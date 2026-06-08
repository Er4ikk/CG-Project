  precision mediump float;

  // Passed in from the vertex shader.
  varying vec2 v_texcoord;
  varying vec4 v_projectedTexcoord;
  varying vec3 v_normal;
  varying vec3 v_surfaceToLight;
  varying vec3 v_surfaceToView;
  
  uniform vec4 u_colorMult;
  uniform sampler2D u_texture;
  uniform sampler2D u_projectedTexture;
  uniform float u_bias;
  uniform float u_shininess;
  uniform vec3 u_lightDirection;
  uniform float u_innerLimit;          // in dot space
  uniform float u_outerLimit;          // in dot space
  
  void main() {
    // because v_normal is a varying it's interpolated
    // so it will not be a unit vector. Normalizing it
    // will make it a unit vector again
    vec3 normal = normalize(v_normal);
  
    vec3 surfaceToLightDirection = normalize(-u_lightDirection);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
  
    // to make a point light effect decomment this line
    // float dotFromDirection = dot(surfaceToLightDirection,
    //                              -u_lightDirection);
    // float limitRange = u_innerLimit - u_outerLimit;
    // float inLight = clamp((dotFromDirection - u_outerLimit) / limitRange, 0.0, 1.0);
    //  float light = inLight * dot(normal, surfaceToLightDirection);

    //global light
    float light =  max(dot(normal, surfaceToLightDirection),0.0);
    float specularIntensity = 0.05;
    float specular =  pow(max(dot(normal, halfVector), u_shininess), 0.0) * specularIntensity ;

  
    vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
    float currentDepth = projectedTexcoord.z + u_bias;
  
    bool inRange =
        projectedTexcoord.x >= 0.0 &&
        projectedTexcoord.x <= 1.0 &&
        projectedTexcoord.y >= 0.0 &&
        projectedTexcoord.y <= 1.0;

    float shadowLight = 1.0;

    if(inRange){
      float shadowSum = 0.0;

      // this should match the DEPTURE_TEXTURE_SIZE   
      float texelSize = 1.0 /2048.0 ;

    //   https://ogldev.org/www/tutorial42/tutorial42.html -> PCF
      for (int y = -1; y <= 1; ++y) {
          for (int x = -1; x <= 1; ++x) {
              vec2 offset = vec2(float(x), float(y)) * texelSize;
              float projectedDepth = texture2D(u_projectedTexture, projectedTexcoord.xy + offset).r;
              
              if (projectedDepth < currentDepth) {
                  shadowSum += 0.2; // shadow intensity
              } else {
                  shadowSum += 1.0; // Pixel bright (very)
              }
          }
      }
      // mean
      shadowLight = shadowSum / 9.0;

    }

  
    // the 'r' channel has the depth values
    // float projectedDepth = texture2D(u_projectedTexture, projectedTexcoord.xy).r;
    // float shadowLight = (inRange && projectedDepth <= currentDepth) ? 0.0 : 1.0;
  
    vec4 texColor = texture2D(u_texture, v_texcoord) * u_colorMult;
    gl_FragColor = vec4(
        texColor.rgb * light * shadowLight +
        specular * shadowLight,
        texColor.a);
  }