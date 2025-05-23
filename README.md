# **URL Shield (No+UsurpaciónDeIdentidad)**

# URL Shield es una aplicación desarrollada en Python utilizando TensorFlow y Keras (RNN) para detectar URLs maliciosas y prevenir el robo de identidad. Este proyecto evalúa múltiples factores de riesgo para clasificar URLs y ayudar a los usuarios a mantenerse seguros en línea.

## **Características**

# - **Detección de URLs Maliciosas**: Analiza URLs en función de varios factores de riesgo.

- **Modelo de Redes Neuronales**: Utiliza una Red Neuronal Recurrente (RNN) para mejorar la precisión de la detección.

- **Interfaz Amigable**: Proporciona una experiencia fácil de usar para que cualquier persona pueda verificar URLs.

## **Factores de Riesgo Evaluados**

# 1. **Longitud de URL**: URLs anormalmente largas pueden ocultar intenciones maliciosas.

2. **Antigüedad del Dominio**: Dominios muy nuevos se asocian a menudo con estafas.

3. **Uso de HTTPS**: La falta de HTTPS es un riesgo significativo.

4. **Subdominios**: Subdominios excesivos pueden ocultar el sitio verdadero.

5. **Palabras Clave**: Palabras como "login", "verify", "update" son comunes en intentos de phishing.

6. **URL con Dirección IP**: Usar una IP en lugar de un nombre de dominio puede ser sospechoso.

7. **TLDs de Riesgo**: Dominios como .zip o .xyz pueden estar asociados con mayor riesgo.

8. **Estado en Listas Negras**: Verifica si el dominio está listado en bases de datos de amenazas.

9. **Estructura de la Ruta**: Rutas inusuales pueden indicar riesgo.

10. **Acortadores de URL**: Pueden ocultar la URL de destino final.

11. **Typosquatting**: URLs que imitan sitios populares con pequeños errores.

## **Instalación**

Para instalar URL Shield, sigue estos pasos:Clona el repositorio:\
\
&#x20;bash\
Copy\
git clone https\://github.com/tuusuario/url-shield.gitcd url-shield1)Instala las dependencias:\
\
&#x20;bash\
Copy\
pip install -r requirements.txt2)
=================================

## **Uso**

# Ejecuta la aplicación con el siguiente comando:bashCopypython app.pyIntroduce la URL que deseas verificar y recibe un informe sobre su seguridad.![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf9kGn-fuwqvASlTt7uqc0FUxMYfdvDuF0kgaYdqGICn-VxkEODAtzFnFsDSX8TCc6cqaayIdaVer2hdPlVhzSxIpomOzHKPGnjc_0pIxRnP1iVEhmV3E5TFVoINGKuZJlLHL3a?key=NdHKYHTIOWHQuL0YysmLmA)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXc0lCMqvVJFiclB6tp2bZFK83InE8QtSVNOb4Vd0IIzq7W5Ta6NVF6LATw3XwRzIlG5DDjc8L_dMnrifZ3LPQJaI2kcNF6eLD73oFMz8cfovFUe8IDw4dHuLDjHIoSTO-xiC1nDvQ?key=NdHKYHTIOWHQuL0YysmLmA)![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcKfb8UViO2USn_50OolmBuzMvGkB3twKZZ_Jc2lD9obB-3zjgiypoPzAdqx9b8IcRAdJmTRh4xL6h00jeuSzXcRuAdZPIgCScO34KIY2N-mAo2FBXrym2h_XswMxUdWMwCm7VFcA?key=NdHKYHTIOWHQuL0YysmLmA)

## **Contribuciones**

# Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o un pull request.

## **Licencia**

# Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
