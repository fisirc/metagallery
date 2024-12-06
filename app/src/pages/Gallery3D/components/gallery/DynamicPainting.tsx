import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from 'three';
import { useExperienceStore } from "@/stores/useExperienceStore";

type DynamicPaintingProps = {
  imageUrl: string;
  vertices: readonly (readonly number[])[];
  title?: string;
  description?: string;
};

export function DynamicPainting({ imageUrl, vertices, title, description }: DynamicPaintingProps) {
  const texture = useTexture(imageUrl);

  // Define a geometry using the provided vertices
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([
      ...vertices[0], // Vertex 1
      ...vertices[1], // Vertex 2
      ...vertices[3], // Vertex 4
      ...vertices[2], // Vertex 3
    ]);
    const uvs = new Float32Array([
      0, 1, // Map vertex 1
      0, 0, // Map vertex 2
      1, 0, // Map vertex 3
      1, 1, // Map vertex 4
    ]);
    const indices = [0, 1, 2, 0, 2, 3]; // Define two triangles

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(indices);

    geo.computeVertexNormals(); // Ensure correct lighting
    return geo;
  }, [vertices]);

  return (
    <>
      <mesh
        geometry={geometry}
        onPointerMove={() => {
        }}
        onPointerEnter={() => {
          useExperienceStore.setState({
            hovering: {
              title: title ?? '',
              description: description ?? '',
            }
          })
        }}
        onPointerLeave={() => {
          useExperienceStore.setState({
            hovering: null
          })
        }}
      >
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} visible />
      </mesh>
    </>
  );
}
