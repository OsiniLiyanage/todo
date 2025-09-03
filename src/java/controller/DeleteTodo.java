/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Todos;
import hibernate.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author acer
 */
@WebServlet(name = "DeleteTodo", urlPatterns = {"/DeleteTodo"})
public class DeleteTodo extends HttpServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;

        try {
            // Get parameters
            String todoIdStr = request.getParameter("id");
            String userIdStr = request.getParameter("userId");

            if (todoIdStr == null || userIdStr == null) {
                responseObject.addProperty("message", "Missing todo ID or user ID");
            } else {
                Long todoId = Long.parseLong(todoIdStr);
                int userId = Integer.parseInt(userIdStr);

                // Find the todo
                Todos todo = (Todos) session.get(Todos.class, todoId);
                if (todo == null) {
                    responseObject.addProperty("message", "Task not found");
                } else {
                    // Verify ownership
                    User user = (User) session.get(User.class, userId);
                    if (user == null || !todo.getUser().equals(user)) {
                        responseObject.addProperty("message", "Unauthorized access");
                    } else {
                        // Delete the todo
                        transaction = session.beginTransaction();
                        session.delete(todo);
                        transaction.commit();
                        responseObject.addProperty("status", true);
                        responseObject.addProperty("message", "Task deleted successfully");
                    }
                }
            }
        } catch (Exception e) {
            if (transaction != null && transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
            responseObject.addProperty("message", "Failed to delete task");
        } finally {
            session.close();
        }

        // Send response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(responseObject));
    }
}