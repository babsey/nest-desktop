Detailed Usage Guide
====================


This is a guide will help you find your way through the graphical interface of NEST Desktop.

.. contents::
   :local:


Get Started
-----------

Once you start NEST Desktop, you will see the loading page with a nice picture
in which two people treat neurons as dandelions.

It checks the compatibility of configurations and databases with the application.
Once it is verified, you can click ``start`` button.

.. note::
   If you think something is broken, you can reload the page.
   You may want to save a protocol. Go the ``Configuration > Simulation`` and enter protocol details under `protocol database`.


Concept of the Layout
---------------------

Next you will see the main page of NEST Desktop with the same concept of the layout for several components:

:Left sidebar: Navigation (it can be closed)
:Center: Main container for the content
:Right sidebar: Controller and configurations, if provided.

|fa-bars| Navigation
^^^^^^^^^^^^^^^^^^^^

NEST Desktop provides three root modules (Simulation, Model, Configuration) and
a module can be selected by clicking on stacked, colored buttons right adjacent to navigation panel.

|gif-navigation|

The navigation will be rendered according to the selected module.
The navigation contains, top a navigation header with the name of the module and, if provided, a |fa-ellipsis-v| for the menu,
and bottom a section content with a list of items.

Content and controller
^^^^^^^^^^^^^^^^^^^^^^
By clicking on an item in the navigation triggers loading the content in the main container
and if provided in the controller panel.

.. note::
   When a section provides a context menu, triggered by right mouse button,
   an icon of mouse-right-button-click appears in left bottom of the page.


|fa-square-root-alt| The Model Module
-------------------------------------

The model module includes the description and the management of the neuron, device and synapse models.

In the left panel, it shows lists of available node and synapse models. Nodes can be stimulators, neurons or recorders.
Once you select a model, the main container displays the documentation as well as a list of parameters with default values.

In the advanced mode, you can manage the models or configure the input panel of individual parameters.
It will store the changes in the model database.
In the input configuration you can define the type of input, label, default value and the unit of the parameter.
Additionally, you can adjust the configuration for the slider of the model parameters.


The Network Module
------------------

The network module as a part of the simulation module is where you can create and modify networks.

|fa-pen| Network editor
^^^^^^^^^^^^^^^^^^^^^^^

When the view mode is set to 'edit', you will see a stretched area of the network sketch for the drawings.
The right controller shows a network selection of created nodes.
'Selected' parameters will be visible for the parameterization in the simulation mode.

You can switch to sketch configuration by clicking on 'bezier-curve' button left to the controller panel.

|fa-shapes| Network sketch
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. raw:: html

   <embed>
     <img src="../_static/img/gif/build-network.gif">
   </embed>

Network sketch is a graphical representation of the network.
You are able to drag, draw and delete node and link elements.

Network list
^^^^^^^^^^^^

It is an fixed list of nodes and links to get an overview of the network.
It appears together with network sketch in simulation details.

Network selection
^^^^^^^^^^^^^^^^^

It is a list of nodes and links, in which you can set the visibility of node parameters.
It appears together with network sketch in the network editor.

Network controller
^^^^^^^^^^^^^^^^^^

It is a list of nodes and links in which you are able to change the parameter values.
It appears together with records visualization in the simulation play.


|fa-brain| The Simulation Module
--------------------------------

In the simulation module, a list of simulations and if provided protocols are displayed in the navigation panel.
You can manage (add/delete/download/upload) protocols in the menu by clicking on the 3 vertical dots icon in the navigation header.

.. note::
   Simulations cannot be deleted because they are integrated in the application.

Once you select a simulation/protocol, it will load from the database and ready for the simulation.
In the main container you will see the colored header and icons at the end of the header.
These icons switch views of the main container. NEST Desktop offers view mode according to icons:

.. raw:: html

   <embed>
     <img src="../_static/img/gif/simulation-toolbar-button.gif">
   </embed>

:floppy disc icon: Save the current network as a protocol.
:eye icon: View node and connection details.
:pen icon: Modify the network and visibility of the node parameters.
:play icon: Modify the parameter values and visualize the results of the simulation.

|fa-eye| Simulation details
^^^^^^^^^^^^^^^^^^^^^^^^^^^

When the view mode is set to 'details', you will find top, a network sketch and bottom, a list of nodes and links.
To improve the affiliation of the nodes and links, each node is labeled by a character and a color.
Each node and link panel starts with a colored header and, if provided, a list of parameters.

You can manage elements (nodes and links) by clicking the right mouse button on the shape
in the sketch area or in the colored header. The context menu shows the a list of options that can be executed.

|fa-play| Simulation playground
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When the view mode is set to 'play', you will see a controller of nodes and links with parameters.
However, the main container remains empty because it does not find records. It is now ready to simulate and
the simulation outcome will be rendered in the main container.

The top header shows three icons: 'chart', 'braille' and 'shapes'.
The chart icon switch to chart panel in the main container.

When the recorded neurons are spatial (by clicking on context menu in node header),
it enables the 'braille' for switching to the animation of the records.

The shapes icon opens the network sketch at the bottom of the center panel to get a quick view.

You can go to the controller of the network, simulation, chart, animation, and stats of the simulation outcome
by clicking on the stacked buttons left to the controller panel

Logging
^^^^^^^

.. raw:: html

   <embed>
     <img src="../_static/img/gif/logging.gif">
   </embed>

Logging component allows you to review the time protocol of the processing checkpoints.
To activate it, go to ``Configuration -> Application`` and then check the item ``Log``.
Once it is activated and after a successful simulation, you can see the logging list in the bottom of the navigation section.

The Visualization Module
------------------------

|fa-chart-line| Chart
^^^^^^^^^^^^^^^^^^^^^

The chart of the recordings is rendered by the library `Plotly.js`.
The chart interface has dragging and zooming handlers.
You can download a snapshot of the current chart by clicking on the camera icon in the top mode panel.

|fa-braille| Animation
^^^^^^^^^^^^^^^^^^^^^^

The animation of the recordings with positions of recorded neurons is rendered by the `three.js`.


|fa-cog| The Configuration Module
---------------------------------

The configuration module is a collection of various configuration of several components.
Once you modified a configuration, it will saves as JSON in local storage of the web browser.


.. |gif-navigation| image:: ../_static/img/gif/navigation.gif

.. |fa-bars| image:: ../_static/font-awesome/bars.svg
   :width: 16px
   :alt:

.. |fa-braille| image:: ../_static/font-awesome/braille.svg
   :width: 16px
   :alt:

.. |fa-brain| image:: ../_static/font-awesome/brain.svg
   :width: 20px
   :alt:

.. |fa-chart-line| image:: ../_static/font-awesome/chart-line.svg
   :width: 16px
   :alt:

.. |fa-cog| image:: ../_static/font-awesome/cog.svg
   :width: 16px
   :alt:

.. |fa-ellipsis-v| image:: ../_static/font-awesome/ellipsis-v.svg
   :width: 8px
   :alt:

.. |fa-eye| image:: ../_static/font-awesome/eye.svg
   :width: 16px
   :alt:

.. |fa-pen| image:: ../_static/font-awesome/pen.svg
   :width: 16px
   :alt:

.. |fa-play| image:: ../_static/font-awesome/play.svg
   :width: 16px
   :alt:

.. |fa-shapes| image:: ../_static/font-awesome/shapes.svg
   :width: 16px
   :alt:

.. |fa-square-root-alt| image:: ../_static/font-awesome/square-root-alt.svg
   :width: 20px
   :alt: