#pragma once

#include <vector>
#include <glm/glm.hpp>

struct Vertex {

    glm::vec3 position;

    glm::vec3 normal;

    glm::vec2 texCoord;

    glm::vec3 tangent;
};

// Вычисление tangent
void computeTangents(
    Vertex& v0,
    Vertex& v1,
    Vertex& v2
) {

    glm::vec3 edge1 =
        v1.position - v0.position;

    glm::vec3 edge2 =
        v2.position - v0.position;

    glm::vec2 deltaUV1 =
        v1.texCoord - v0.texCoord;

    glm::vec2 deltaUV2 =
        v2.texCoord - v0.texCoord;

    float f =
        1.0f /
        (
            deltaUV1.x * deltaUV2.y -
            deltaUV2.x * deltaUV1.y
        );

    glm::vec3 tangent;

    tangent.x =
        f * (
            deltaUV2.y * edge1.x -
            deltaUV1.y * edge2.x
        );

    tangent.y =
        f * (
            deltaUV2.y * edge1.y -
            deltaUV1.y * edge2.y
        );

    tangent.z =
        f * (
            deltaUV2.y * edge1.z -
            deltaUV1.y * edge2.z
        );

    tangent = normalize(tangent);

    v0.tangent = tangent;

    v1.tangent = tangent;

    v2.tangent = tangent;
}

class Cube {

public:

    static std::vector<Vertex> getVertices() {

        return {

            // Передняя грань
            {{-0.5f,-0.5f, 0.5f},{ 0.0f, 0.0f, 1.0f},{0.0f,0.0f},{0,0,0}},
            {{ 0.5f,-0.5f, 0.5f},{ 0.0f, 0.0f, 1.0f},{1.0f,0.0f},{0,0,0}},
            {{ 0.5f, 0.5f, 0.5f},{ 0.0f, 0.0f, 1.0f},{1.0f,1.0f},{0,0,0}},
            {{-0.5f, 0.5f, 0.5f},{ 0.0f, 0.0f, 1.0f},{0.0f,1.0f},{0,0,0}},

            // Задняя грань
            {{-0.5f,-0.5f,-0.5f},{ 0.0f, 0.0f,-1.0f},{0.0f,0.0f},{0,0,0}},
            {{-0.5f, 0.5f,-0.5f},{ 0.0f, 0.0f,-1.0f},{1.0f,1.0f},{0,0,0}},
            {{ 0.5f, 0.5f,-0.5f},{ 0.0f, 0.0f,-1.0f},{0.0f,1.0f},{0,0,0}},
            {{ 0.5f,-0.5f,-0.5f},{ 0.0f, 0.0f,-1.0f},{1.0f,0.0f},{0,0,0}},

            // Левая грань
            {{-0.5f,-0.5f,-0.5f},{-1.0f,0.0f,0.0f},{0.0f,0.0f},{0,0,0}},
            {{-0.5f,-0.5f, 0.5f},{-1.0f,0.0f,0.0f},{1.0f,0.0f},{0,0,0}},
            {{-0.5f, 0.5f, 0.5f},{-1.0f,0.0f,0.0f},{1.0f,1.0f},{0,0,0}},
            {{-0.5f, 0.5f,-0.5f},{-1.0f,0.0f,0.0f},{0.0f,1.0f},{0,0,0}},

            // Правая грань
            {{ 0.5f,-0.5f,-0.5f},{ 1.0f,0.0f,0.0f},{0.0f,0.0f},{0,0,0}},
            {{ 0.5f,-0.5f, 0.5f},{ 1.0f,0.0f,0.0f},{1.0f,0.0f},{0,0,0}},
            {{ 0.5f, 0.5f, 0.5f},{ 1.0f,0.0f,0.0f},{1.0f,1.0f},{0,0,0}},
            {{ 0.5f, 0.5f,-0.5f},{ 1.0f,0.0f,0.0f},{0.0f,1.0f},{0,0,0}},

            // Нижняя грань
            {{-0.5f,-0.5f,-0.5f},{0.0f,-1.0f,0.0f},{0.0f,0.0f},{0,0,0}},
            {{ 0.5f,-0.5f,-0.5f},{0.0f,-1.0f,0.0f},{1.0f,0.0f},{0,0,0}},
            {{ 0.5f,-0.5f, 0.5f},{0.0f,-1.0f,0.0f},{1.0f,1.0f},{0,0,0}},
            {{-0.5f,-0.5f, 0.5f},{0.0f,-1.0f,0.0f},{0.0f,1.0f},{0,0,0}},

            // Верхняя грань
            {{-0.5f,0.5f,-0.5f},{0.0f,1.0f,0.0f},{0.0f,0.0f},{0,0,0}},
            {{-0.5f,0.5f, 0.5f},{0.0f,1.0f,0.0f},{1.0f,0.0f},{0,0,0}},
            {{ 0.5f,0.5f, 0.5f},{0.0f,1.0f,0.0f},{1.0f,1.0f},{0,0,0}},
            {{ 0.5f,0.5f,-0.5f},{0.0f,1.0f,0.0f},{0.0f,1.0f},{0,0,0}}
        };
    }

    static std::vector<unsigned int> getIndices() {

        std::vector<unsigned int> indices;

        for (unsigned int i = 0; i < 24; i += 4) {

            indices.push_back(i + 0);
            indices.push_back(i + 1);
            indices.push_back(i + 2);

            indices.push_back(i + 0);
            indices.push_back(i + 2);
            indices.push_back(i + 3);
        }

        return indices;
    }
};