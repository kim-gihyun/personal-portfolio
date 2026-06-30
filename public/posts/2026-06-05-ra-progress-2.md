# RA Progress Report — 2

The first step of creating the aforementioned structure in [RA Progress Report — 1](post.html?p=2026-05-29-ra-progress-1.md) was to first generate the TPU gyroid structure using a MATLAB script, then export it as a `.stl` file which would then be sent to the Prusa Slicer to be printed. This concept was previously proven where TPMS structures were 3D printed in similar fashion (Peng et al., 2022). Though the structures printed and further tested are drastically different, the concept of MATLAB-to-3D-printing remained viable for this study. Therefore, the following MATLAB script was created.

```matlab
grid_size = 60;
inner_size = 30;
thickness_z = 1.0;
resolution = 300;
unit_cell_size = 3.75;
w = 2 * pi / unit_cell_size;

x = linspace(-grid_size/2, grid_size/2, resolution);
y = linspace(-grid_size/2, grid_size/2, resolution);
z = linspace(0, thickness_z, 30);
[X, Y, Z] = meshgrid(x, y, z);

U_Gyroid = sin(w.*X).*cos(w.*Y) + sin(w.*Y).*cos(w.*Z) + sin(w.*Z).*cos(w.*X);

dist_from_center = max(abs(X), abs(Y));

transition = 1 ./ (1 + exp(-1.5 * (dist_from_center - inner_size/2)));
threshold_map = -0.6 + (0.8 .* transition);

[f, v] = isosurface(X, Y, Z, U_Gyroid - threshold_map, 0);

if isempty(f)
error('Geometry too thin for current cell size. Reduce unit_cell_size.');
else
tr = triangulation(f, v);
stlwrite(tr, '3D_TENG_Fabric.stl');

% Visual Check
patch('Faces', f, 'Vertices', v, 'FaceColor', [0.4 0.4 0.4], 'EdgeColor', 'none');
daspect([1 1 1]); view(3); camlight; lighting gouraud;
fprintf('Saved: 3D_TENG_Fabric.stl with Z=%.1fmm\n', thickness_z);
end
```

The script utilizes the implicit gyroid equation of

> sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x) = c

where x, y, z are the spatial coordinates and c is the isosurface constant (controls the porosity of the gyroid structure).

Using the script, the following structure was created:

![Gyroid structure generated in MATLAB](assets/blog/ra2-p2-02.png)

![The structure in SolidWorks — isometric and top views](assets/blog/ra2-p2-03.png)
*Section enclosed by the red box indicates the stress-resistant region where the electrodes would be placed.*

However, after weeks of attempting to realize this concept, which proved valid in concept, the 3D printing consistently failed, with the following images providing an analysis of the print results (these slides were presented to the SHIN Group members on 04/06/2026).

![Fabric printing — success rate 33% (2/6), thickness 600–800 µm, criteria for success](assets/blog/ra2-p3-04.png)

![Failure — thickness ≤ 600 µm, incomplete / broken cells, core cell < 2 mm, outer cell < 4 mm](assets/blog/ra2-p3-05.png)

![Successes — thickness 800 µm, core cell ≥ 2 mm, outer cell ≥ 4 mm and < 6 mm](assets/blog/ra2-p4-06.png)

![Analysis of a failed print — significant number of blobs, TPU strings and fragments throughout cells](assets/blog/ra2-p4-07.png)

![Analysis of a successful print — smaller blobs, fewer print fragments](assets/blog/ra2-p5-08.png)

![Conclusion — failure conditions and potential causes in both printer and code](assets/blog/ra2-p5-09.png)

On the bright side, the electrode pattern testing did prove to be successful: a grid structure composed of Glass (substrate) – X electrodes – Fluorinated Ethylene Propylene (FEP) – Y electrodes – FEP was able to detect signals in all four contact points with minimal crosstalk (as shown in the slide below).

![The fabricated electrode grid](assets/blog/ra2-p6-10.png)

![Oscilloscope traces for taps at each of the four contact points](assets/blog/ra2-p6-11.png)

However, the 5-layer structure would be nearly impossible to successfully print using a regular 3D printer, let alone the one present in the lab (Prusa MK3 i3 — purchased circa 2019).

Thus, we decided to pivot to a different yet somewhat similar idea that would build on the successes and failures of this one — to be discussed in the next progress report.

## References

Peng, C., Marzocca, P., & Tran, P. (2022). Triply periodic minimal surfaces based honeycomb structures with tuneable mechanical responses. *Virtual and Physical Prototyping, 18*(1). [https://doi.org/10.1080/17452759.2022.2125879](https://doi.org/10.1080/17452759.2022.2125879)
