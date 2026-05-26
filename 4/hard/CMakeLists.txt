cmake_minimum_required(VERSION 3.10)
project(OpenGLLab4)

set(CMAKE_CXX_STANDARD 17)

include_directories(
    src
    C:/Programs/glad/include
    C:/Programs/glm-master
    C:/Programs/glfw-3.4.bin.WIN64/include
)

link_directories(
    C:/Programs/glfw-3.4.bin.WIN64/lib-mingw-w64
)

add_executable(OpenGLLab4
    src/main.cpp
    src/texture.cpp
    C:\\Programs\\glad\\src\\glad.c
)

target_link_libraries(OpenGLLab4
    glfw3
    opengl32
)