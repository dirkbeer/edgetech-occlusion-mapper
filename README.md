<a name="readme-top"></a>

[contributors-shield]: https://img.shields.io/github/contributors/IQTLabs/edgetech-template.svg?style=for-the-badge
[contributors-url]: https://github.com/IQTLabs/edgetech-template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/IQTLabs/edgetech-template.svg?style=for-the-badge
[forks-url]: https://github.com/IQTLabs/edgetech-template/network/members
[stars-shield]: https://img.shields.io/github/stars/IQTLabs/edgetech-template.svg?style=for-the-badge
[stars-url]: https://github.com/IQTLabs/edgetech-template/stargazers
[issues-shield]: https://img.shields.io/github/issues/IQTLabs/edgetech-template.svg?style=for-the-badge
[issues-url]: https://github.com/IQTLabs/edgetech-template/issues
[license-shield]: https://img.shields.io/github/license/IQTLabs/edgetech-template.svg?style=for-the-badge
[license-url]: https://github.com/IQTLabs/edgetech-template/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
[python]: https://img.shields.io/badge/python-000000?style=for-the-badge&logo=python
[python-url]: https://www.python.org
[poetry]: https://img.shields.io/badge/poetry-20232A?style=for-the-badge&logo=poetry
[poetry-url]: https://python-poetry.org
[docker]: https://img.shields.io/badge/docker-35495E?style=for-the-badge&logo=docker
[docker-url]: https://www.docker.com

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://iqt.org">
    <img src="images/logo.png" alt="Logo" width="331" height="153"/>
  </a>
</div>

<h1 align="center">EdgeTech Occlusion Mapper</h1>

This repo is designed to be part of a SkyScan system. SkyScan automatically points a Pan Tilt Zoom (PTZ) camera at an aircraft based on the location information broadcast in an ADS-B message. Occlusion Mapper lets you map out objects that are blocking the view of a PTZ camera so that they can be avoided. It produces an array of Azimuth and Elevation values. This array provides what is the lowest possible elevation that can be used at a given azimuth.


## Usage


Download the [SkyScan](https://github.com/IQTLabs/SkyScan) Repo. In that repo run: `docker compose -f docker-compose -occlusion.yaml`

If the container is running locally, navigate to: [http://localhost:5000](http://localhost:5000) in your browser.

Otherwise, if the container is running on another machine, navigate to that IP address with port 5000. For example: `http://192.168.1.111:5000`

This will bring up a rudimentary web interface that lets you control the camera and record different Azimuth/Elevation values. To map out the occlusions around your camera:

1. Starting at 0° azimuth, find the camera elevation where you begin to have a clear view of the sky in the middle of the screen. 
1. Next hit the **Add Point** button to record this value. The Graph at the bottom of the screen should update with this value. 
1. Move the camera to the right. If the center of the frame no longer lines up with where planes would begin to be visible, adjust the Elevation and then hit **Add Point**
1. Continue this process until you have arrive back at 0° azimuth


### Built With

[![Python][python]][python-url]
[![Poetry][poetry]][poetry-url]
[![Docker][docker]][docker-url]

## License

Distributed under the [Apache 2.0](https://github.com/IQTLabs/edgetech-occlusion-mapper/blob/main/LICENSE). See `LICENSE.txt` for more information.

## Contact IQTLabs

- Twitter: [@iqtlabs](https://twitter.com/iqtlabs)
- Email: labsinfo@iqt.org

See our other projects: [https://github.com/IQTLabs/](https://github.com/IQTLabs/)


