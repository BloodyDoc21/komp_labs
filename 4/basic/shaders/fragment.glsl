#version 330 core

in vec2 TexCoord;
in vec3 FragPos;
in vec3 Normal;

out vec4 FragColor;

uniform sampler2D uTexture;

uniform vec3 uLightPos;
uniform vec3 uViewPos;

void main() {

    vec3 texColor =
        texture(uTexture, TexCoord).rgb;

    // Эффект старой бумаги
    texColor *= vec3(
        1.0,
        0.92,
        0.75
    );

    // Ambient
    vec3 ambient =
        0.45 * texColor;

    // Specular
    vec3 norm =
        normalize(Normal);

    vec3 lightDir =
        normalize(
            uLightPos - FragPos
        );

    vec3 viewDir =
        normalize(
            uViewPos - FragPos
        );

    vec3 reflectDir =
        reflect(
            -lightDir,
            norm
        );

    float spec =
        pow(
            max(dot(viewDir, reflectDir), 0.0),
            8.0
        );

    vec3 specular =
        vec3(0.25) * spec;

    vec3 result =
        ambient + specular;

    FragColor =
        vec4(result, 1.0);
}