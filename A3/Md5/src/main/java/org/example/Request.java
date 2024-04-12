package org.example;

public class Request {
    private String course_uri;
    private String action;
    private String value;

    public Request() {
    }

    public String getcourse_uri() {
        return course_uri;
    }

    public void setcourse_uri(String course_uri) {
        this.course_uri = course_uri;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
