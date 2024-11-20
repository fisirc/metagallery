<div align="center">

<video src="iamlarry.mp4" controls></video>

# Stiller

---

</div>

## What is Stiller

Stiller is both a **single-node** content distribution "network" and
multi-purposed server created as part of the MetaGallery project. It is built as
a totally self-contained, sqlite-based web service deployed through air and
actions.

## Components

Stiller is built almost totally upon the stdlib http serving packages except for
the router (where
[julienschmidt/httprouter](https://github.com/julienschmidt/httprouter) shines).

## About these docs

These docs contain simple information about each and every one of the server
endpoints. Those which have this logo:

<div align="center" style="text-align: center;">

<img src="./jwt_logo.png" style="width: 100px;"/>

</div>

At the "#Path" section of their documentation are supposed to pass a [`token:
<jwt token>`] along with the endpoint's usual request body and payload elements.

