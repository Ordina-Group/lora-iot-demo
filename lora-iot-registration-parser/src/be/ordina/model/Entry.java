package be.ordina.model;

import java.time.LocalDateTime;

public class Entry {

    private LocalDateTime dateTime;
    private String name;
    private String email;
    private String companyOrSchool;
    private Boolean isInterestedInJob;

    public Entry(LocalDateTime dateTime, String name, String email, String companyOrSchool, Boolean isInterestedInJob) {
        this.dateTime = dateTime;
        this.name = name;
        this.email = email;
        this.companyOrSchool = companyOrSchool;
        this.isInterestedInJob = isInterestedInJob;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Date: \t\t").append(dateTime.toString()).append("\n");
        sb.append("Name: \t\t").append(name).append("\n");
        sb.append("email: \t\t").append(email).append("\n");
        sb.append("Company: \t").append(companyOrSchool).append("\n");

        if(isInterestedInJob) {
            sb.append("Interested: yes \n");
        } else {
            sb.append("Interested: no \n");
        }

        sb.append("-------------------------------");

        return sb.toString();
    }

    //Getters & setters:
    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompanyOrSchool() {
        return companyOrSchool;
    }

    public void setCompanyOrSchool(String companyOrSchool) {
        this.companyOrSchool = companyOrSchool;
    }

    public Boolean getIsInterestedInJob() {
        return isInterestedInJob;
    }

    public void setIsInterestedInJob(Boolean isInterestedInJob) {
        this.isInterestedInJob = isInterestedInJob;
    }
}