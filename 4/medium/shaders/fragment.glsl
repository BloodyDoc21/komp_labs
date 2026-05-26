#version 330 core

in vec2 TexCoord;
in vec3 FragPos;
in mat3 TBN;

out vec4 FragColor;

uniform sampler2D uDiffuseMap;
uniform sampler2D uNormalMap;

uniform vec3 uLightPos;
uniform vec3 uViewPos;

uniform float uTime;

void main() {

    // Основная текстура
    vec3 texColor =
        texture(
            uDiffuseMap,
            TexCoord
        ).rgb;

    // Normal map
    vec3 normal =
        texture(
            uNormalMap,
            TexCoord
        ).rgb;

    normal =
        normalize(
            normal * 2.0 - 1.0
        );

    normal =
        normalize(
            TBN * normal
        );

    // Свет
    vec3 lightDir =
        normalize(
            uLightPos - FragPos
        );

    // Ambient
    vec3 ambient =
        0.45 * texColor;

    // Diffuse
    float diff =
        max(
            dot(normal, lightDir),
            0.0
        );

    vec3 diffuse =
        diff * texColor;

    // НЕОН
    float pulse =
        sin(uTime * 2.0) * 0.5 + 0.5;

    vec3 neon =
        vec3(
            0.1,
            0.1,
            0.35
        ) * pulse;

    // Итог
    vec3 result =
        ambient +
        diffuse +
        neon;

    FragColor =
        vec4(result, 1.0);
}