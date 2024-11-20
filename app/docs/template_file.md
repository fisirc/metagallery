# Template files

The metagallery template file format is no more than a tarball containing
the following files:

```txt
template.tar/
  |- slots.json
  |- topview.svg
  +- scene.glb
```

The `slots.json` file contains the information about the available slots in
the scene for the user to drop images/3D models.

```json
[
  {
    "id": "slot1",
    "type": "2d",
    "props": {},
    "v": [
      [-2.190093, 2.930420, 1.957159],
      [-2.190091, 1.010420, 1.957159],
      [-3.686093, 2.930418, 1.957160],
      [-3.686091, 1.010419, 1.957160]
    ]
  },
  {
    "id": "slot2",
    "type": "3d",
    "props": {
      "rotating": false,
      "scale": 1
    },
    "v": [
      [-2.190093, 2.930420, 1.957159]
    ]
  },
]
```

For `2d` slots, the `v` array should contain the 4 vertices that represent the
4 corners of the slot frame.

For `3d` slots, the `v` array should contain a single vertex that represents
the origin position of the 3D model. If `rotating` is enabled (default=`false`),
the model will constantly rotate around the Z axis. If the `scale` property
exists (default=`1`), the model will be scaled by the given factor.
