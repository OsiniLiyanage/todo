package controller;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLDecoder;
import org.hibernate.Session;
import org.hibernate.Transaction;
import hibernate.Todos;
import hibernate.User;

@WebServlet(name = "EditTodo", urlPatterns = {"/EditTodo"})
public class EditTodo extends HttpServlet {

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;

        try {
            // Read query parameters
            String todoIdStr = request.getParameter("id");
            String userIdStr = request.getParameter("userId");

            // Read body manually to get 'title'
            StringBuilder body = new StringBuilder();
            try (BufferedReader reader = request.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) {
                    body.append(line);
                }
            }

            // Parse form-encoded body: "title=Buy+milk" → extract value
            String newTitle = null;
            String bodyStr = body.toString();
            if (bodyStr.contains("title=")) {
                String[] parts = bodyStr.split("=", 2);
                if (parts.length == 2) {
                    newTitle = URLDecoder.decode(parts[1], "UTF-8");
                }
            }

            System.out.println("todoIdStr: " + todoIdStr);
            System.out.println("userIdStr: " + userIdStr);
            System.out.println("newTitle: " + newTitle); // Now should NOT be null

            if (todoIdStr == null || userIdStr == null || newTitle == null || newTitle.trim().isEmpty()) {
                responseObject.addProperty("message", "Missing required parameters");
            } else {
                Long todoId = Long.parseLong(todoIdStr);
                int userId = Integer.parseInt(userIdStr);

                Todos todo = (Todos) session.get(Todos.class, todoId);
                if (todo == null) {
                    responseObject.addProperty("message", "Task not found");
                } else {
                    User user = (User) session.get(User.class, userId);
                    if (user == null || !todo.getUser().equals(user)) {
                        responseObject.addProperty("message", "Unauthorized access");
                    } else {
                        transaction = session.beginTransaction();
                        todo.setTitle(newTitle.trim());
                        session.update(todo);
                        transaction.commit();

                        responseObject.addProperty("status", true);
                        responseObject.addProperty("message", "Task updated successfully");
                    }
                }
            }
        } catch (Exception e) {
            if (transaction != null && transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
            responseObject.addProperty("message", "Failed to update task");
        } finally {
            session.close();
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(responseObject));
    }
}