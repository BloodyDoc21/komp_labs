#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#include "texture.h"
#include <iostream>
Texture::Texture() : m_id(0), m_width(0), m_height(0), m_channels(0) {}
Texture::~Texture() {
 if (m_id) glDeleteTextures(1, &m_id);
}
bool Texture::loadFromFile(const std::string& path) {
 // Загрузка изображения через stb_image
 stbi_set_flip_vertically_on_load(true); // OpenGL ожидает Y вверх
 unsigned char* data = stbi_load(path.c_str(), &m_width, &m_height, &m_channels, 0);
 if (!data) {
 std::cerr << "Failed to load texture: " << path << std::endl;
 return false;
 }
 // Определяем формат текстуры
 GLenum format;
 if (m_channels == 1) format = GL_RED;
 else if (m_channels == 3) format = GL_RGB;
 else if (m_channels == 4) format = GL_RGBA;
 else format = GL_RGB;
 // Создание текстуры OpenGL
 glGenTextures(1, &m_id);
 glBindTexture(GL_TEXTURE_2D, m_id);
 // Настройка параметров
 glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
 glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
 glTexParameteri(
     GL_TEXTURE_2D,
     GL_TEXTURE_MIN_FILTER,
     GL_LINEAR_MIPMAP_LINEAR
 );
 glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
 // Загрузка данных
 glTexImage2D(GL_TEXTURE_2D, 0, format, m_width, m_height, 0, format, GL_UNSIGNED_BYTE, data);

 glGenerateMipmap(GL_TEXTURE_2D);
 glTexParameterf(
     GL_TEXTURE_2D,
     GL_TEXTURE_LOD_BIAS,
     -0.5f
 );
 // Освобождаем память
 stbi_image_free(data);
 std::cout << "Loaded texture: " << path << " (" << m_width << "x" << m_height << ")" << std::endl;
 return true;
}
void Texture::bind(unsigned int unit) const {
 glActiveTexture(GL_TEXTURE0 + unit);
 glBindTexture(GL_TEXTURE_2D, m_id);
}
void Texture::unbind() const {
 glBindTexture(GL_TEXTURE_2D, 0);
}