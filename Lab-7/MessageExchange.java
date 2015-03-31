
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.util.List;

public class MessageExchange {

    private JSONParser jsonParser = new JSONParser();

    public String getToken(int index) {
        Integer number = index * 8 + 11;
        return "TN" + number + "EN";
    }

    public int getIndex(String token) {
        return (Integer.valueOf(token.substring(2, token.length() - 2)) - 11) / 8;
    }

    public String getServerResponse(List<Message> messages) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("messages", messages);
        jsonObject.put("token", getToken(messages.size()));
        return jsonObject.toJSONString();
    }

    String getClientSendMessageRequest(String id, String name, String message, String info) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
        jsonObject.put("user", name);
        jsonObject.put("message", message);
        jsonObject.put("info", info);
        return jsonObject.toJSONString();
    }

    public Message getClientMessage(InputStream inputStream) throws ParseException {
        Message message = new Message();
        JSONObject messageJsonObject = getJSONObject(inputStreamToString(inputStream));
        message.setId((String) messageJsonObject.get("id"));
        message.setName((String) messageJsonObject.get("user"));
        message.setMessage((String) messageJsonObject.get("message"));
        message.setInfo((String) messageJsonObject.get("info"));
        return message;
    }

    public String getDeleteRequest(InputStream inputStream) throws ParseException {
        JSONObject jsonObject = getJSONObject(inputStreamToString(inputStream));
        return (String) jsonObject.get("id");
    }
    
    public JSONObject getPutRequest(InputStream inputStream) throws ParseException {
        return getJSONObject(inputStreamToString(inputStream));
    }

    public JSONObject getJSONObject(String json) throws ParseException {
        return (JSONObject) jsonParser.parse(json.trim());
    }

    public String inputStreamToString(InputStream in) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length = 0;
        try {
            while ((length = in.read(buffer)) != -1) {
                baos.write(buffer, 0, length);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new String(baos.toByteArray());
    }
}
