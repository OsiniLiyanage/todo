/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Session;

/**
 *
 * @author acer
 */
@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    private static final String UPLOAD_PATH = "profile_image";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        String firstname = request.getParameter("firstName");
        String lastname = request.getParameter("lastName");

        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        Part filePart = request.getPart("profileImage");
        System.out.println(firstname);
        System.out.println(lastname);
        System.out.println(email);

        if (firstname.isEmpty()) {
            responseObject.addProperty("message", "firstname is required!");
        } else if (lastname.isEmpty()) {
            responseObject.addProperty("message", "lastname is required!");
        } else if (email.isEmpty()) {
            responseObject.addProperty("message", "Email is required!");
        } else if (!Util.isEmailValid(email)) {
            responseObject.addProperty("message", "Enter valid email address");
        } else if (password.isEmpty()) {
            responseObject.addProperty("message", "Password is required!");
        } else if (!Util.isPasswordValid(password)) {
            responseObject.addProperty("message", "The password must contain at least uppercase, lowercase letter, number, special character and be minimum eight characters long!");
        } else if (!password.equals(confirmPassword)) {
            responseObject.addProperty("message", "Password didn't match!");

        } else if (filePart == null) {
            responseObject.addProperty("message", "Profile image is required");
        } else {

            String appPath = getServletContext().getRealPath("");
            String newPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + UPLOAD_PATH);
            System.out.println(newPath);
            File uploadDir = new File(newPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String profileName = System.currentTimeMillis() + "_profile.png";
            File profile = new File(uploadDir, profileName);
            Files.copy(filePart.getInputStream(), profile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            Session s = HibernateUtil.getSessionFactory().openSession();

            User newUser = new User(firstname, lastname, email, password, profileName, new Date());
            s.save(newUser);
            s.beginTransaction().commit();

            JsonObject userObj = new JsonObject();
            userObj.addProperty("id", newUser.getId());
            userObj.addProperty("email", newUser.getEmail());
            userObj.addProperty("firstName", newUser.getFirstName());
            userObj.addProperty("lastName", newUser.getLastName());

            responseObject.add("user", userObj);
            responseObject.addProperty("status", true);
            s.close();
            //response.getWriter().write("Done");
            //response.setStatus(HttpServletResponse.SC_OK);
        }
        Gson gson = new Gson();
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }

}
