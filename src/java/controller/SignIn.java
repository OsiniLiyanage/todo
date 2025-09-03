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
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author acer
 */
@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);
   //    System.out.println(signI);

        String email = requestJsonObject.get("email").getAsString();
        String password = requestJsonObject.get("password").getAsString();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (email.isEmpty()) {
            responseObject.addProperty("message", " Email can not be empty!");
        } else if (password.isEmpty()) {
            responseObject.addProperty("message", " password can not be empty!");
        } else {
            Session s = HibernateUtil.getSessionFactory().openSession();
            Criteria cl = s.createCriteria(User.class);
            cl.add(Restrictions.eq("email", email));
            cl.add(Restrictions.eq("password", password));
            List<User> userList = cl.list();
            if (userList.isEmpty()) {
                responseObject.addProperty("message", "Invalid credentials. Please check again.");
            } else {
                User user = userList.get(0);
                user.setPassword("");
                responseObject.add("loggedUser", gson.toJsonTree(user));
                
                JsonObject userObj = new JsonObject();
            userObj.addProperty("id", user.getId());          
            userObj.addProperty("email", user.getEmail());
            userObj.addProperty("firstName", user.getFirstName());
            userObj.addProperty("lastName", user.getLastName());

            responseObject.add("user", userObj);
                
                responseObject.addProperty("status", true);
                s.close();
            }
        }

        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
    }

}
