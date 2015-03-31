
class Message {

    private String id;
    private String name;
    private String message;
    private String info;

    public Message() {
        this.id = "";
        this.name = "";
        this.message = "";
        this.info = "";
    }

    public Message(String id, String name, String message, String delited) {
        this.id = id;
        this.name = name;
        this.message = message;
        this.info = delited;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String value) {
        this.id = value;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String value) {
        this.name = value;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String value) {
        this.message = value;
    }
    
    public String getInfo() {
        return this.info;
    }

    public void setInfo(String value) {
        this.info = value;
    }

    @Override
    public String toString() {
        return "{\"id\":\"" + this.id + "\",\"user\":\"" + this.name + "\",\"message\":\"" + this.message + "\"}";
    }
}
