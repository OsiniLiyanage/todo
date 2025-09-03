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
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import model.Util;
import org.hibernate.Session;

@WebServlet(name = "UpdateProfile", urlPatterns = {"/UpdateProfile"})
@MultipartConfig
public class UpdateProfile extends HttpServlet {

    private static final String UPLOAD_PATH = "profile_image";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        Part filePart = request.getPart("profileImage");
        
        System.out.println(firstName);
        System.out.println(lastName);
        System.out.println(password);
        System.out.println(confirmPassword);
        System.out.println(filePart);

        // Validate input
        if (firstName == null || firstName.trim().isEmpty()) {
            responseObject.addProperty("message", "First name is required");
        } else if (lastName == null || lastName.trim().isEmpty()) {
            responseObject.addProperty("message", "Last name is required");
        } else if (password != null && !password.equals(confirmPassword)) {
            responseObject.addProperty("message", "Passwords don't match");
        } else {
            String appPath = getServletContext().getRealPath("");
            String newPath = appPath.replace("build" + java.io.File.separator + "web", "web" + java.io.File.separator + UPLOAD_PATH);
            java.io.File uploadDir = new java.io.File(newPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String profileName = System.currentTimeMillis() + "_profile.png";
            java.io.File profile = new java.io.File(uploadDir, profileName);
            Files.copy(filePart.getInputStream(), profile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            Session s = HibernateUtil.getSessionFactory().openSession();
            User user = (User) s.get(User.class, Integer.parseInt(request.getParameter("userId")));
            user.setFirstName(firstName.trim());
            user.setLastName(lastName.trim());
            if (password != null) {
                user.setPassword(password.trim());
            }
            user.setProfileImagePath(profileName);
            s.beginTransaction();
            s.update(user);
            s.getTransaction().commit();

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Profile updated successfully");
            s.close();
        }

        Gson gson = new Gson();
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
    }
}