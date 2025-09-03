/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;

@WebServlet(name = "GetUserProfile", urlPatterns = {"/GetUserProfile"})
public class GetUserProfile extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            String userIdStr = request.getParameter("userId");
            if (userIdStr == null || userIdStr.trim().isEmpty()) {
                responseObject.addProperty("message", "User ID is required");
            } else {
                int userId = Integer.parseInt(userIdStr);
                User user = (User) session.get(User.class, userId);
                if (user == null) {
                    responseObject.addProperty("message", "User not found");
                } else {
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("profileImagePath", user.getProfileImagePath());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseObject.addProperty("message", "Failed to load profile");
        } finally {
            session.close();
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(responseObject));
    }
}