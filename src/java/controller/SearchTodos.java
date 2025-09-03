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
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author acer
 */
@WebServlet(name = "SearchTodos", urlPatterns = {"/SearchTodos"})
public class SearchTodos extends HttpServlet {

    private static final SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy hh:mm a");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            // Get parameters
            String userIdStr = request.getParameter("userId");
            String query = request.getParameter("query");

            if (userIdStr == null || userIdStr.trim().isEmpty()) {
                responseObject.addProperty("message", "User ID is required");
            } else if (query == null || query.trim().isEmpty()) {
                responseObject.addProperty("message", "Search query is required");
            } else {
                int userId = Integer.parseInt(userIdStr);

                // Fetch user
                User user = (User) session.get(User.class, userId);
                if (user == null) {
                    responseObject.addProperty("message", "User not found");
                } else {
                    // Search todos by title (case-insensitive) and user
                    Criteria criteria = session.createCriteria(Todos.class);
                    criteria.add(Restrictions.eq("user", user));
                    criteria.add(Restrictions.ilike("title", query.trim(), MatchMode.ANYWHERE)); // LIKE %query%
                    criteria.addOrder(Order.desc("id"));

                    List<Todos> todoList = criteria.list();
                    List<JsonObject> todoDataList = new ArrayList<>();

                    for (Todos todo : todoList) {
                        JsonObject todoObj = new JsonObject();
                        todoObj.addProperty("id", todo.getId());
                        todoObj.addProperty("title", todo.getTitle());
                        todoObj.addProperty("isDone", todo.isIsDone());
                        todoObj.addProperty("createdAt", sdf.format(todo.getCreated_at()));
                        todoDataList.add(todoObj);
                    }

                    // Add to response
                    responseObject.add("todos", gson.toJsonTree(todoDataList));
                    responseObject.addProperty("status", true);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseObject.addProperty("message", "Failed to search tasks.");
        } finally {
            session.close();
        }

        // Send response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(responseObject));
    }
}