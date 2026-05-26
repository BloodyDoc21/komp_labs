#version 330 core

in vec2 TexCoord;
in vec3 FragPos;
in mat3 TBN;

out vec4 FragColor;

uniform sampler2D uDiffuseMap;
uniform sampler2D uNormalMap;
uniform sampler2D uRoughnessMap;

uniform vec3 uLightPos;
uniform vec3 uViewPos;

void main() {

    // Texture
    vec3 albedo =
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

    // Roughness
    float roughness =
        texture(
            uRoughnessMap,
            TexCoord
        ).r;

    // Lighting
    vec3 lightDir =
        normalize(
            uLightPos - FragPos
        );

    vec3 viewDir =
        normalize(
            uViewPos - FragPos
        );

    // Ambient
    vec3 ambient =
        0.15 * albedo;

    // Diffuse
    float diff =
        max(
            dot(normal, lightDir),
            0.0
        );

    vec3 diffuse =
        diff * albedo;

    // Specular
    vec3 reflectDir =
        reflect(
            -lightDir,
            normal
        );

    float shininess =
        mix(
            4.0,
            128.0,
            1.0 - roughness
        );

    float spec =
        pow(
            max(
                dot(viewDir, reflectDir),
                0.0
            ),
            shininess
        );

    float specStrength =
        mix(
            0.8,
            0.05,
            roughness
        );

    vec3 specular =
        vec3(specStrength * spec);

    // Final
    vec3 result =
        ambient +
        diffuse +
        specular;

    FragColor =
        vec4(result, 1.0);
}