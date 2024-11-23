"""
Utility to print all the selected nodes into the Blender console

Usage:
1. Go to the Scripting tab in Blender
2. Paste this file
3. In Edit mode, select the nodes you want to print
4. Run the script and copy the output in the console

The output is written to the system terminal, so if you don't see it,
try opening Blender from a terminal emulator.

Author: @paoloose
"""
import bpy
import bmesh

# Get the active mesh
obj = bpy.context.edit_object
me = obj.data


# Get a BMesh representation
bm = bmesh.from_edit_mesh(me)

bm.faces.active = None

arr = []

for v in bm.verts:
    if v.select:
        global_coord = obj.matrix_world @ v.co
        x, y, z = list(global_coord)
        arr.append(str(
            [round(x, 3), round(z, 3), round(-y + 0.01, 3)]
        ))

# Reorering nodes
arr = [arr[1], arr[0], arr[3], arr[2]]

print()
print(',\n'.join(arr))
