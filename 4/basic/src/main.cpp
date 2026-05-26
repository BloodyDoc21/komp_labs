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

#include "cube_data.h"
#include "texture.h"

// Обработка ввода
void processInput(GLFWwindow* window) {

    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
}

// Чтение файла
std::string readFile(const char* path) {

    std::ifstream file(path);

    if (!file.is_open()) {

        std::cerr
            << "Failed to open file: "
            << path
            << std::endl;

        return "";
    }

    std::stringstream buffer;

    buffer << file.rdbuf();

    return buffer.str();
}

// Создание shader program
GLuint createShaderProgram(
    const char* vertexPath,
    const char* fragmentPath
) {

    std::string vertexCode = readFile(vertexPath);

    std::string fragmentCode = readFile(fragmentPath);

    const char* vShaderCode = vertexCode.c_str();

    const char* fShaderCode = fragmentCode.c_str();

    int success;

    char infoLog[512];

    // Vertex shader
    GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);

    glShaderSource(
        vertexShader,
        1,
        &vShaderCode,
        NULL
    );

    glCompileShader(vertexShader);

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
            << "VERTEX SHADER ERROR:\n"
            << infoLog
            << std::endl;
    }

    // Fragment shader
    GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);

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
            << "FRAGMENT SHADER ERROR:\n"
            << infoLog
            << std::endl;
    }

    // Shader program
    GLuint shaderProgram = glCreateProgram();

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
            << "SHADER PROGRAM LINK ERROR:\n"
            << infoLog
            << std::endl;
    }

    glDeleteShader(vertexShader);

    glDeleteShader(fragmentShader);

    return shaderProgram;
}

int main() {

    // GLFW
    glfwInit();

    glfwWindowHint(
        GLFW_CONTEXT_VERSION_MAJOR,
        3
    );

    glfwWindowHint(
        GLFW_CONTEXT_VERSION_MINOR,
        3
    );

    glfwWindowHint(
        GLFW_OPENGL_PROFILE,
        GLFW_OPENGL_CORE_PROFILE
    );

    // Окно
    GLFWwindow* window = glfwCreateWindow(
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

    // GLAD
    if (!gladLoadGLLoader(
        (GLADloadproc)glfwGetProcAddress
    )) {

        std::cout
            << "Failed to initialize GLAD"
            << std::endl;

        return -1;
    }

    glViewport(0, 0, 800, 600);

    // Depth test
    glEnable(GL_DEPTH_TEST);

    // Данные куба
    std::vector<Vertex> vertices =
        Cube::getVertices();

    std::vector<unsigned int> indices =
        Cube::getIndices();

    for (size_t i = 0; i < indices.size(); i += 3) {

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

    // VBO
    glBindBuffer(GL_ARRAY_BUFFER, VBO);

    glBufferData(
        GL_ARRAY_BUFFER,
        vertices.size() * sizeof(Vertex),
        vertices.data(),
        GL_STATIC_DRAW
    );

    // EBO
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

    // Position
    glVertexAttribPointer(
        0,
        3,
        GL_FLOAT,
        GL_FALSE,
        sizeof(Vertex),
        (void*)offsetof(Vertex, position)
    );

    glEnableVertexAttribArray(0);

    // Normal
    glVertexAttribPointer(
        1,
        3,
        GL_FLOAT,
        GL_FALSE,
        sizeof(Vertex),
        (void*)offsetof(Vertex, normal)
    );

    glEnableVertexAttribArray(1);

    // Texture coordinates
    glVertexAttribPointer(
        2,
        2,
        GL_FLOAT,
        GL_FALSE,
        sizeof(Vertex),
        (void*)offsetof(Vertex, texCoord)
    );

    glEnableVertexAttribArray(2);

    // Tangent
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
    Texture texture;
    if (!texture.loadFromFile(
        "../textures/paper.jpg"
    )) {

        std::cout
            << "Texture loading failed!"
            << std::endl;
    }

    // Shader program
    GLuint shaderProgram =
        createShaderProgram(
            "../shaders/vertex.glsl",
            "../shaders/fragment.glsl"
        );

    glUseProgram(shaderProgram);

    // Uniforms
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

    GLint texLoc =
        glGetUniformLocation(
            shaderProgram,
            "uTexture"
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

    glUniform1i(texLoc, 0);

    // Свет
    glm::vec3 lightPos =
        glm::vec3(
            1.2f,
            1.0f,
            2.0f
        );

    // Камера
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

    // Главный цикл
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

        // Вращение
static float lastTime = glfwGetTime();

float currentTime = glfwGetTime();

if (currentTime - lastTime >= 0.3f) {

    angle += 0.1f;

    lastTime = currentTime;
}

        glm::mat4 model =
            glm::mat4(1.0f);

        model = glm::rotate(
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

    texture.bind(0);

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

    // Очистка
    glDeleteVertexArrays(1, &VAO);

    glDeleteBuffers(1, &VBO);

    glDeleteBuffers(1, &EBO);

    glfwTerminate();

    return 0;
}