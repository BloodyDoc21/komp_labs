#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <cmath>

#include "cube_data.h"
#include "texture.h"

void framebuffer_size_callback(
    GLFWwindow* window,
    int width,
    int height
) {
    glViewport(0, 0, width, height);
}

void processInput(GLFWwindow* window) {

    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS) {

        glfwSetWindowShouldClose(window, true);
    }
}

std::string readFile(const char* path) {

    std::ifstream file(path);

    if (!file.is_open()) {

        std::cout
            << "Failed to open file: "
            << path
            << std::endl;

        return "";
    }

    std::stringstream buffer;

    buffer << file.rdbuf();

    return buffer.str();
}

GLuint createShaderProgram(
    const char* vertexPath,
    const char* fragmentPath
) {

    std::string vertexCode =
        readFile(vertexPath);

    std::string fragmentCode =
        readFile(fragmentPath);

    const char* vShaderCode =
        vertexCode.c_str();

    const char* fShaderCode =
        fragmentCode.c_str();

    GLuint vertexShader =
        glCreateShader(GL_VERTEX_SHADER);

    glShaderSource(
        vertexShader,
        1,
        &vShaderCode,
        NULL
    );

    glCompileShader(vertexShader);

    GLint success;
    char infoLog[512];

    glGetShaderiv(
        vertexShader,
        GL_COMPILE_STATUS,
        &success
    );

    if (!success) {

        glGetShaderInfoLog(
            vertexShader,
            512,
            NULL,
            infoLog
        );

        std::cout
            << "Vertex shader error:\n"
            << infoLog
            << std::endl;
    }

    GLuint fragmentShader =
        glCreateShader(GL_FRAGMENT_SHADER);

    glShaderSource(
        fragmentShader,
        1,
        &fShaderCode,
        NULL
    );

    glCompileShader(fragmentShader);

    glGetShaderiv(
        fragmentShader,
        GL_COMPILE_STATUS,
        &success
    );

    if (!success) {

        glGetShaderInfoLog(
            fragmentShader,
            512,
            NULL,
            infoLog
        );

        std::cout
            << "Fragment shader error:\n"
            << infoLog
            << std::endl;
    }

    GLuint shaderProgram =
        glCreateProgram();

    glAttachShader(
        shaderProgram,
        vertexShader
    );

    glAttachShader(
        shaderProgram,
        fragmentShader
    );

    glLinkProgram(shaderProgram);

    glGetProgramiv(
        shaderProgram,
        GL_LINK_STATUS,
        &success
    );

    if (!success) {

        glGetProgramInfoLog(
            shaderProgram,
            512,
            NULL,
            infoLog
        );

        std::cout
            << "Shader link error:\n"
            << infoLog
            << std::endl;
    }

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);

    return shaderProgram;
}


int main() {

    glfwInit();

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(
        GLFW_OPENGL_PROFILE,
        GLFW_OPENGL_CORE_PROFILE
    );

    GLFWwindow* window =
        glfwCreateWindow(
            800,
            600,
            "OpenGL Lab4",
            NULL,
            NULL
        );

    if (window == NULL) {

        std::cout
            << "Failed to create GLFW window"
            << std::endl;

        glfwTerminate();

        return -1;
    }

    glfwMakeContextCurrent(window);

    glfwSetFramebufferSizeCallback(
        window,
        framebuffer_size_callback
    );

    if (
        !gladLoadGLLoader(
            (GLADloadproc)glfwGetProcAddress
        )
    ) {

        std::cout
            << "Failed to initialize GLAD"
            << std::endl;

        return -1;
    }

    glViewport(0, 0, 800, 600);

    glEnable(GL_DEPTH_TEST);

    // Куб

    std::vector<Vertex> vertices =
        Cube::getVertices();

    std::vector<unsigned int> indices =
        Cube::getIndices();

    for (
        size_t i = 0;
        i < indices.size();
        i += 3
    ) {

        computeTangents(
            vertices[indices[i]],
            vertices[indices[i + 1]],
            vertices[indices[i + 2]]
        );
    }

    GLuint VAO, VBO, EBO;

    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);

    glBindVertexArray(VAO);

    glBindBuffer(GL_ARRAY_BUFFER, VBO);

    glBufferData(
        GL_ARRAY_BUFFER,
        vertices.size() * sizeof(Vertex),
        vertices.data(),
        GL_STATIC_DRAW
    );

    glBindBuffer(
        GL_ELEMENT_ARRAY_BUFFER,
        EBO
    );

    glBufferData(
        GL_ELEMENT_ARRAY_BUFFER,
        indices.size() * sizeof(unsigned int),
        indices.data(),
        GL_STATIC_DRAW
    );

    // position
    glVertexAttribPointer(
        0,
        3,
        GL_FLOAT,
        GL_FALSE,
        sizeof(Vertex),
        (void*)offsetof(Vertex, position)
    );

    glEnableVertexAttribArray(0);

    // normal
    glVertexAttribPointer(
        1,
        3,
        GL_FLOAT,
        GL_FALSE,
        sizeof(Vertex),
        (void*)offsetof(Vertex, normal)
    );

    glEnableVertexAttribArray(1);

    // texcoord
    glVertexAttribPointer(
        2,
        2,
        GL_FLOAT,
        GL_FALSE,
        sizeof(Vertex),
        (void*)offsetof(Vertex, texCoord)
    );

    glEnableVertexAttribArray(2);

    // tangent
    glVertexAttribPointer(
        3,
        3,
        GL_FLOAT,
        GL_FALSE,
        sizeof(Vertex),
        (void*)offsetof(Vertex, tangent)
    );

    glEnableVertexAttribArray(3);

    // Textures

    Texture diffuseTexture;
    Texture normalTexture;

    diffuseTexture.loadFromFile(
        "../textures/carpet.jpg"
    );

    normalTexture.loadFromFile(
        "../textures/carpet_normal.jpg"
    );

    // Shaders

    GLuint shaderProgram =
        createShaderProgram(
            "../shaders/vertex.glsl",
            "../shaders/fragment.glsl"
        );

    glUseProgram(shaderProgram);

    GLint diffuseLoc =
        glGetUniformLocation(
            shaderProgram,
            "uDiffuseMap"
        );

    GLint normalLoc =
        glGetUniformLocation(
            shaderProgram,
            "uNormalMap"
        );

    GLint modelLoc =
        glGetUniformLocation(
            shaderProgram,
            "uModel"
        );

    GLint viewLoc =
        glGetUniformLocation(
            shaderProgram,
            "uView"
        );

    GLint projLoc =
        glGetUniformLocation(
            shaderProgram,
            "uProjection"
        );

    GLint lightPosLoc =
        glGetUniformLocation(
            shaderProgram,
            "uLightPos"
        );

    GLint viewPosLoc =
        glGetUniformLocation(
            shaderProgram,
            "uViewPos"
        );

    GLint timeLoc =
        glGetUniformLocation(
            shaderProgram,
            "uTime"
        );

    glUniform1i(diffuseLoc, 0);
    glUniform1i(normalLoc, 1);

    glm::vec3 cameraPos =
        glm::vec3(
            0.0f,
            0.0f,
            3.0f
        );

    glm::vec3 cameraTarget =
        glm::vec3(
            0.0f,
            0.0f,
            0.0f
        );

    glm::vec3 cameraUp =
        glm::vec3(
            0.0f,
            1.0f,
            0.0f
        );

    float angle = 0.0f;

    while (!glfwWindowShouldClose(window)) {

        processInput(window);

        glClearColor(
            0.2f,
            0.3f,
            0.3f,
            1.0f
        );

        glClear(
            GL_COLOR_BUFFER_BIT |
            GL_DEPTH_BUFFER_BIT
        );

        angle += 0.001f;

        glm::mat4 model =
            glm::mat4(1.0f);

        model =
            glm::rotate(
                model,
                angle,
                glm::vec3(
                    1.0f,
                    1.0f,
                    0.0f
                )
            );

        glm::mat4 view =
            glm::lookAt(
                cameraPos,
                cameraTarget,
                cameraUp
            );

        glm::mat4 projection =
            glm::perspective(
                glm::radians(45.0f),
                800.0f / 600.0f,
                0.1f,
                100.0f
            );

        glUniformMatrix4fv(
            modelLoc,
            1,
            GL_FALSE,
            glm::value_ptr(model)
        );

        glUniformMatrix4fv(
            viewLoc,
            1,
            GL_FALSE,
            glm::value_ptr(view)
        );

        glUniformMatrix4fv(
            projLoc,
            1,
            GL_FALSE,
            glm::value_ptr(projection)
        );

        glm::vec3 lightPos =
            glm::vec3(
                sin(glfwGetTime()) * 2.0f,
                1.5f,
                cos(glfwGetTime()) * 2.0f
            );

        glUniform3fv(
            lightPosLoc,
            1,
            glm::value_ptr(lightPos)
        );

        glUniform3fv(
            viewPosLoc,
            1,
            glm::value_ptr(cameraPos)
        );

        glUniform1f(
            timeLoc,
            glfwGetTime()
        );

        diffuseTexture.bind(0);
        normalTexture.bind(1);

        glBindVertexArray(VAO);

        glDrawElements(
            GL_TRIANGLES,
            indices.size(),
            GL_UNSIGNED_INT,
            0
        );

        glfwSwapBuffers(window);

        glfwPollEvents();
    }

    glDeleteVertexArrays(1, &VAO);

    glDeleteBuffers(1, &VBO);

    glDeleteBuffers(1, &EBO);

    glfwTerminate();

    return 0;
}