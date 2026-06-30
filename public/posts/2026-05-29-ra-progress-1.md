# RA Progress Report — 1

Over the past few months, the project I've been working on focused on creating a TENG-enabled input device that would essentially be self-powered through actions from the user such as tapping and swiping. The concept was inspired by numerous studies including the BISNC Interface contrived by Shi & Lee in 2019, which utilized an Ecoflex – Aluminum tape – PTFE triple-layer structure, with the PTFE being the friction layer, as a potential self-powered input device for drones and other applications.

## Background

Specifically, in their study, by using a single-electrode type TENG (Triboelectric Nanogenerator), they were able to interpret the changes in voltage caused by the sliding of the nitrile glove and convert it to a binary signal. This signal would then be sent from the interface to the desired application (drones, VR/AR, IoT, etc.) to initiate the programmed action.

![Bio-inspired spider-net-coding interface concept](assets/blog/ra1-p1-01.png)
*(Shi & Lee, 2019)*

As different patterns would generate different triboelectric signals with varying peaks and troughs (as shown in the figure below), different binary inputs could be generated. Providing a unique proposition of a batteryless input source.

![Eight sliding patterns and their distinct voltage signatures](assets/blog/ra1-p2-02.png)
*(Shi & Lee, 2019)*

## Limitations

However, this method did have its limitations. Ecoflex, the substrate used in their study, has the benefits of providing flexibility to the structure, allowing it to be used even under strain, but is not a viable long-term use material. Due to its tackiness and tendency to trap moisture, it may cause skin irritation and bacterial growth if not maintained in good condition — though different gel formulations could mitigate certain downsides. Furthermore, the Al tape used for the electrode pattern requires precise positioning and cutting of the tape, which limits the type and complexity of the patterns that can be created.

Though different configurations have been tested, such as the 4-electrode ratio method which uses the ratio of electric field signals on either side of the x-y position to locate the input location (Chen et al., 2018) and using 8 × 8 grid patterns with X and Y electrodes stacked on top of each other (Wang et al., 2018), they suffer from difficulty of accurate input detection under strain.

## Proposal

Thus, an idea of utilizing a Triply Periodic Minimal Surface (TPMS), a gyroid specifically, as the substrate and a conductive TPU (C-TPU) as the electrode layer was conjured. Using additive manufacturing techniques, a gyroid pattern of thickness 400–600 µm would be 3D-printed with the center region of size 50 × 50 mm being denser than the outer region by approximately 55%. Then, C-TPU patterns (also 3D printed) would be added on the center region to act as the electrode layer.

The rationale behind this composition is that a gyroid TPU with 400–600 µm thickness would provide anisotropic tendencies under stress, providing resistance to tensile stress but would easily be bent to conform to human body shapes for input detection. The composition of a dense center region where the electrodes would sit and a more flexible outer region would create a watch-like structure all from the same material and pattern type, with only the density being the differentiating factor. Hence, while the C-TPU electrodes would be stress-free for consistent input processing, only the outer region of the substrate would undergo controlled movements under stress. This would improve on past studies as this system would exhibit superior tendencies in dealing with tensile stress only in crucial regions, boosting signal reception and providing a tunable substrate which creates an interface free from the constraints of specific attributes of a single material composition.

![Sample of the concept, fabricated in the lab](assets/blog/ra1-p3-03.png)
*Sample image of the concept created in the lab by Dr. Zhou*

## References

Shi, Q., & Lee, C. (2019). Self-Powered Bio-Inspired Spider-Net-Coding Interface Using Single-Electrode Triboelectric Nanogenerator. *Advanced Science, 6*(15). [https://doi.org/10.1002/advs.201900617](https://doi.org/10.1002/advs.201900617)

Chen, T., Shi, Q., Zhu, M., He, T., Sun, L., Yang, L., & Lee, C. (2018). Triboelectric Self-Powered Wearable Flexible Patch as 3D Motion Control Interface for Robotic Manipulator. *ACS Nano, 12*(11), 11561–11571. [https://doi.org/10.1021/acsnano.8b06747](https://doi.org/10.1021/acsnano.8b06747)

Wang, X., Zhang, Y., Zhang, X., Huo, Z., Li, X., Que, M., Peng, Z., Wang, H., & Pan, C. (2018). A Highly Stretchable Transparent Self-Powered Triboelectric Tactile Sensor with Metallized Nanofibers for Wearable Electronics. *Advanced Materials, 30*(12). [https://doi.org/10.1002/adma.201706738](https://doi.org/10.1002/adma.201706738)
