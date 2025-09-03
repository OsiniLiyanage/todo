/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import hibernate.HibernateUtil;
import hibernate.Todos;
import hibernate.User;
import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;

@WebServlet(name = "AddTodo", urlPatterns = {"/AddTodo"})
public class AddTodo extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        try {
            //Read JSON from request body
            BufferedReader reader = request.getReader();
            JsonObject json = JsonParser.parseReader(reader).getAsJsonObject();

            String title = json.get("title").getAsString();
            int userId = json.get("userId").getAsInt();
            
            System.out.println(title);
            System.out.println(userId);

            // Validation
            if (title == null || title.trim().isEmpty()) {
                responseObject.addProperty("message", "Task title is required");
            } else {
                Session session = HibernateUtil.getSessionFactory().openSession();
                session.beginTransaction();

                //Find user by ID
                User user = (User) session.get(User.class, userId);
                if (user == null) {
                    responseObject.addProperty("message", "User not found");
                } else {
                    //Create and save todo
                    Todos todo = new Todos();
                    todo.setTitle(title);
                    todo.setIsDone(false);
                    todo.setCreated_at(new java.util.Date());
                    todo.setUser(user);

                    session.save(todo);
                    session.getTransaction().commit(); // Save to DB
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Task added successfully");

                    System.out.println("Todo saved: " + title);
                }
                session.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseObject.addProperty("message", "Server error: " + e.getMessage());
        }

        // Send JSON response (same style as SignUp)
        Gson gson = new Gson();
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(toJson);
    }
}