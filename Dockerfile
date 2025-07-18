FROM openjdk:21
LABEL authors="admin"

COPY backend/build/libs/backend-0.01-SNAPSHOT.jar prj.jar

ENTRYPOINT ["java", "-jar", "prj.jar"]
