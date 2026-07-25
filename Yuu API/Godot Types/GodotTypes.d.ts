

/**
 * Options used to select what type of animation & physics a node will have, if any
 * - Empty: Node3D: Generic node type
 * - Static: StaticBody3D: For colliders that never move
 * - Animated: AnimatableBody3D: For colliders that are animated
 * - Physics: RigidBody3D: For colliders that use the physics engine
 *  */
type BaseNodeTypes = 'Empty' | 'Static' | 'Animated' | 'Physics';

/**
 * Options used to select what type of collider the physics engine will use
 * - Convex: most optimized collider, works on both static and animated colliders, doesn't support accurate indents or holes (ie. doorway or cave entrance)
 * - Concave: for static colliders, best in specific use cases where you need more accurate collision, ie. a doorway, cave entrance 
 *  */
type ColliderTypes = 'Convex' | 'Concave';

type ControllerButtonPressed = 'rightA' | 'rightB' | 'leftX' | 'leftY' | 'leftMenu' | 'leftTrigger' | 'rightTrigger' | 'leftGrip' | 'rightGrip' | 'leftThumbstick' | 'rightThumbstick'; // 'rightHome' is used for the right menu button, but on Quest is never triggered as the app is exited when the button is clicked


// declare namespace console {
//   function log(msg: any): boolean;
//   function debug(msg: any): boolean;
//   function warn(msg: any): boolean;
//   function error(msg: any): boolean;
// }


declare namespace Godot {
  const async: {
    /**
   * Cause a callback function to run after a delay of ms
   * @param func to run
   * @param ms to wait
   * @returns number id to use for clearing the timer, returns -1 if there is an error
   */
    setTimeout: (func: () => void, ms: number) => number;

    /**
     * Cause a callback function to run after a delay of ms, and loop with the same delay until the timer is cleared
     * @param func to run
     * @param ms to wait
     * @returns number id to use for clearing the timer, returns -1 if there is an error
     */
    setInterval: (func: () => void, ms: number) => number;

    /**
     * Using the id returned by the setTimeout & setInterval functions, you can unsubscribe
     * @param id to unsubscribe
     * @returns boolean true if the timer was found and cleared
     */
    clearTimer: (id: number) => boolean;
  }

  const events: {
    /**
   * Subscribe a function to the process / frame update
   * @param func to subscribe
   * @returns number id that can be used to unsubscribe, returns -1 if there is an error
   */
    onUpdate: (func: (deltaTime: number) => void) => number;

    /**
     * Subscribe a function to the physics process update
     * @param func to subscribe
     * @returns number id that can be used to unsubscribe, returns -1 if there is an error
     */
    onPhysicsUpdate: (func: (deltaTime: number) => void) => number;

    /**
     * Subscribe a function to receive keyboard input
     * @param func to subscribe
     * @returns number id that can be used to unsubscribe, returns -1 if there is an error
     */
    onKeyboardInput: (func: (input: string) => void) => number;

    /**
     * Subscribe a function to receive controller inputs
     * @param func to subscribe
     * @returns number id that can be used to unsubscribe, returns -1 if there is an error
     */
    onControllerInput: (func: (inputsPressed: ControllerButtonPressed[]) => void) => number;

    /**
     * Using the id returned by the subscribe function, you can unsubscribe
     * @param id to unsubscribe
     * @returns boolean true if the id was found and unsubscribed
     */
    unsubscribe: (id: number) => boolean;
  }


  const files: {
    /**
     * Checks if a file exists and returns a boolean if true
     * @param filePath to check including extension
     * @returns boolean true if the file exists
     */
    exists: (filePath: string) => boolean;

    text: {
      /**
       * Create a text file at the specified directory with corresponding name and extension (overwrites if it already exists)
       * @param dirPath location to save the file
       * @param fileName to use
       * @param fileExtension to append (ie. '.txt')
       * @param content to be saved in the file
       * @returns true if successful
       */
      create: (dirPath: string, fileName: string, fileExtension: string, content: string) => boolean;
      /**
       * Updates if the file exists or creates a text file if it doesn't already exist
       * @param dirPath location to save the file
       * @param fileName to use
       * @param fileExtension to append (ie. '.txt')
       * @param content to be saved in the file
       * @returns true if successful
       */
      update: (dirPath: string, fileName: string, fileExtension: string, content: string) => boolean;
      /**
       * Get the contents of a text file
       * @param dirPath location of the file
       * @param fileName to get
       * @param fileExtension ie. '.txt'
       * @returns string contents, or undefined if unsuccessful
       */
      get: (dirPath: string, fileName: string, fileExtension: string) => string | undefined;
    }
    folder: {
      /**
       * Checks if a folder exists and returns a boolean if true
       * @param dirPath to check
       * @returns boolean true if the directory exists
       */
      exists: (dirPath: string) => boolean;

      /**
       * Create a folder at the specified dirPath
       * @param dirPath to create a folder at, recursive path to the directory will be created if it doesn't exist
       * @returns boolean true if successful (false if already exists, or other error occurs)
       */
      create: (dirPath: string) => boolean;

      /**
       * Delete the folder and recursively delete contents at the specified dirPath
       * @param dirPath to delete
       * @returns boolean true if successful
       */
      delete: (dirPath: string) => boolean;

      /**
       * Get the contents of a dirPath
       * @param dirPath to get contents of
       * @param isRecursive if true will return contents of sub folders as well
       * @returns array of [directory path, file/folder name, file extension, "?" if no extension, or "" empty string for folders]
       */
      getContents: (dirPath: string, isRecursive: boolean) => [string, string, string][];

      /**
       * Transpile TS Files to JS, runs async, use areTSFilesTranspiled to check when it is completed
       * @param tsPath folder to transpile
       * @param jsPath folder to store js files into
       * @returns boolean true if successfully queued
       */
      transpileTSFolderToJSFolder: (tsPath: string, jsPath: string) => boolean;
      areTSFilesTranspiled: () => boolean;
      tsFilesRemainingToBeCompiled: () => number;

      /**
       * Create a JS Virtual Machine
       * @param jsPath folder of JS files to run
       * @returns number id to close vm later, undefined if something went wrong
       */
      createJSVM: (jsPath: string) => number | undefined;
      closeJSVM: (id: number) => boolean;

      /**
       * Get the VM Folder Path, useful for storing files related to the VM (stats, saves, etc)
       * @returns the path of the root VM folder
       */
      getVMPath: () => string;
    }
    zip: {
      /**
       * Compress the contents of a folder into a zip file at a specified location
       * @param dirPathToCompress folder to compress into a zip
       * @param saveZipToDirPath folder to save the zip file to
       * @param zipFileName to use, without extension (ie. 'File_Name')
       * @returns boolean true if successful
       */
      compressFolder: (dirPathToCompress: string, saveZipToDirPath: string, zipFileName: string) => boolean;

      /**
       * Extract files from a zip into a folder
       * @param zipDirPath to extract from, inclusive of extension (ie. user://worlds/folder_name/world_name.zip)
       * @param saveDirPath location to save the uncompressed files to
       * @returns boolean true if successful
       */
      extractFiles: (zipDirPath: string, saveDirPath: string) => boolean;
    }
  }

  const image: {
    /**
     * Create an image
     * @param width in pixels
     * @param height in pixels
     * @returns number id of image
     */
    create: (width: number, height: number) => number | undefined;

    /**
     * Delete an image from memory
     * @param id of image
     * @returns boolean true if image exists and was deleted
     */
    delete: (id: number) => boolean;

    /**
     * Apply a texture to a mesh node
     * @param nodeID of the mesh
     * @param imageID of the image
     * @returns boolean true if successful
     */
    applyAsTextureToMesh: (nodeID: number, imageID: number) => boolean;

    /**
     * Get the color of a pixel
     * @param imageID to get pixel data from
     * @param x of pixel coord
     * @param y of pixel coord
     * @returns color data or undefined if invalid
     */
    getPixelColor: (imageID: number, x: number, y: number) => { r: number, g: number, b: number, a: number } | undefined;

    /**
     * Set the color of a pixel
     * @param imageID to effect
     * @param pixels array of x, y values
     * @param r of color
     * @param g of color
     * @param b of color
     * @param a alpha value
     * @returns boolean true if successful
     */
    setPixelsColor: (imageID: number, pixels: Int32Array, r: number, g: number, b: number, a: number) => boolean;

    /**
     * Blend new color with the existing pixel color
     * @param imageID to effect
     * @param pixels array of x, y values
     * @param r of color
     * @param g of color
     * @param b of color
     * @param a alpha value
     * @param originalPercentRemaining amount of the original color to keep (ranging from 0 to 1)
     * @returns boolean true if successful
     */
    blendPixelsColor: (imageID: number, pixels: Int32Array, r: number, g: number, b: number, a: number, originalPercentRemaining: number) => boolean;

    /** Fill an entire image with a given color
    * @param imageID to effect
    * @param r of color
    * @param g of color
    * @param b of color
    * @param a alpha value, if using undefined it keeps the original alpha (but is less optimized)
    * @returns boolean true if successful
    */
    fillWithColor: (imageID: number, r: number, g: number, b: number, a: number | undefined) => boolean;

    /**
     * Goes through all pixels in an image, and if they match the first color, they are set to the new color
     * @param imageID to effect
     * @param r1 red of color to swap
     * @param g1 green of color to swap
     * @param b1 blue of color to swap
     * @param a1 alpha of color to swap
     * @param r2 red of color to apply
     * @param g2 green of color to apply
     * @param b2 blue of color to apply
     * @param a2 alpha of color to apply
     * @returns boolean true if successful
     */
    swapColorWithNewColor: (imageID: number, r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number | undefined) => boolean;

    /**
     * Goes through pixels in an image, from the starting pixel, and if they match the first pixel color, they are set to the new color
     * @param imageID to effect
     * @param x of pixel to connected fill
     * @param y of pixel to connected fill
     * @param r2 red of color to apply
     * @param g2 green of color to apply
     * @param b2 blue of color to apply
     * @param a2 alpha of color to apply
     * @returns boolean true if successful
     */
    fillConnectedColorWithNewColor: (imageID: number, x: number, y: number, r2: number, g2: number, b2: number, a2: number | undefined) => boolean;

    /** Fill a rectangle on an image with a given color
    * @param imageID to effect
    * @param r of color
    * @param g of color
    * @param b of color
    * @param a alpha value
    * @param x pixel coordinate
    * @param y pixel coordinate
    * @param width of rectangle in pixels
    * @param height of rectangle in pixels
    * @returns boolean true if successful
    */
    fillRectWithColor: (imageID: number, r: number, g: number, b: number, a: number, x: number, y: number, width: number, height: number) => boolean;

    /** Fill a rectangle on an image with a rectangle from another image
    * @param destImageID to effect
    * @param destX pixel coordinate
    * @param destY pixel coordinate
    * @param rectImageID to copy from to fill the dest rect with
    * @param copyFromX pixel coordinate
    * @param copyFromY pixel coordinate
    * @param width of rectangle in pixels
    * @param height of rectangle in pixels
    * @returns boolean true if successful
    */
    fillRectWithImage: (destImageID: number, destX: number, destY: number, rectImageID: number, copyFromX: number, copyFromY: number, width: number, height: number) => boolean;

    /** Fill a rectangle on an image with a rectangle from another image using alpha
    * @param destImageID to effect
    * @param destX pixel coordinate
    * @param destY pixel coordinate
    * @param rectImageID to copy from to fill the dest rect with
    * @param copyFromX pixel coordinate
    * @param copyFromY pixel coordinate
    * @param width of rectangle in pixels
    * @param height of rectangle in pixels
    * @returns boolean true if successful
    */
    blendRectWithImage: (destImageID: number, destX: number, destY: number, rectImageID: number, copyFromX: number, copyFromY: number, width: number, height: number) => boolean;

    /**
    * Updates the texture
    * @param imageID to update
    * @returns boolean true if successful
    */
    updateTexture: (imageID: number) => boolean;

    /**
    * Updates the mip maps
    * @param imageID to update
    * @returns boolean true if successful
    */
    updateMipMaps: (imageID: number) => boolean;

    /**
    * Deletes the mip maps
    * @param imageID to delete from
    * @returns boolean true if successful
    */
    deleteMipMaps: (imageID: number) => boolean;
  }

  const node: {
    /**
     * List of available GodotNode types that can be created
     */
    create: {
      /**
       * Create a base node
       * @param parentID provide node id if you want it to be a sub node, undefined creates a top level node
       * @param type is used to select what type of animation & physics it will have, if any
       * @returns the id of the created node
       */
      base: (parentID: number | undefined, type: BaseNodeTypes) => number | undefined;

      /**
       * Create a mesh child node
       * @param parentID node to attach mesh as a child node to
       * @param verts XYZ Positions (each vert position is a multiple of 3)
       * @param uvs UV Texture Mapping (2 for each vert, represents the XY position on a texture image)
       * @param triangles Each Triangle Is A Set Of 3 Vert Indexes (order determines normal orientation)
       * @returns Number id of the newly created mesh node, or undefined if there is an error
       * 
       * `Single Triangle Example:` Bottom Left, Bottom Right, Top Left
       * 
       * `verts:` new Float32Array([
       * 
       * 0, 0, 0,
       * 
       * 1, 0, 0,
       * 
       * 0, 1, 0,
       * 
       * ])
       * 
       * `uvs:` new Float32Array([
       * 
       * 0, 0,
       * 
       * 1, 0,
       * 
       * 0, 1,
       * 
       * ])
       * 
       * `triangles:` new Int32Array([
       * 
       * 0, 1, 2
       * 
       * ])
       */
      mesh: (parentID: number, verts: Float32Array, uvs: Float32Array, triangles: Int32Array) => number | undefined;

      collider: {
        /**
         * Create a collider from a mesh node
         * @param parentID to attach as a child to
         * @param meshNodeID node to get mesh from
         * @param type used to select what type of collider the physics engine will use
         * @returns the id of the created node
         */
        fromMeshNode: (parentID: number, meshNodeID: number, type: ColliderTypes) => number | undefined;
        /**
         * Create a sphere collider
         * @param parentID to attach as a child to
         * @param radius distance from the center of the sphere to the edge of the sphere collider
         * @returns the id of the created node
         */
        sphere: (parentID: number, radius: number) => number | undefined;
        /**
         * Create a cylinder collider
         * @param parentID to attach as a child to
         * @param radius distance from the center to the edge of the cylinder collider
         * @param height distance from the top to the bottom of the cylinder collider
         * @returns the id of the created node
         */
        cylinder: (parentID: number, radius: number, height: number) => number | undefined;
        /**
         * Create a capsule collider
         * @param parentID to attach as a child to
         * @param radius distance from the center to the edge of the capsule collider
         * @param height distance from the top to the bottom of the capsule collider
         * @returns the id of the created node
         */
        capsule: (parentID: number, radius: number, height: number) => number | undefined;
        /**
         * Create a box collider
         * @param parentID to attach as a child to
         * @param x distance across the x axis
         * @param y distance across the y axis
         * @param z distance across the z axis
         * @returns the id of the created node
         */
        box: (parentID: number, x: number, y: number, z: number) => number | undefined;
      };

      /**
       * Creates a text node
       * @param parentID to host the text
       * @param text to be displayed
       * @param fontSize to be used, ie. 40
       * @param outlineSize to be used, (int, ie. 0, 1, 2+)
       * @returns the id of the created node
       */
      text: (parentID: number, text: string, fontSize: number, outlineSize: number) => number | undefined;

      /**
       * Creates an audio node
       * @param parentID to host the audio (for spatial audio this parent will determine the position)
       * @param isSpatial if true the audio exists in 3D space (too many of these playing simultaneously will cause problems)
       * @returns the id of the created node
       */
      audio: (parentID: number, isSpatial: boolean) => number | undefined;
    };

    /**
     * Useful for changing a base node to a different animation node type.
     * Note that changing does create a new node, and moves children to the new node.
     * Therefore this should be done sparingly.
     * @param id of the node to change
     * @type to change the node to
     * @returns id of the new node if successful and undefined if there is an error
     */
    changeType: (id: number, type: BaseNodeTypes) => number | undefined;

    visible: {
      set: (id: number, isVisible: boolean) => boolean,
      get: (id: number) => boolean | undefined,
    };

    collidable: {
      set: (id: number, isCollidable: boolean) => boolean,
      get: (id: number) => boolean | undefined,
    };

    /**
    * List of available transform options
    */
    transform: {
      position: {
        /**
         * Sets the position of a node
         * @param id of the node to move
         * @param x of position
         * @param y of position
         * @param z of position
         * @returns boolean true if successful
         */
        set: (id: number, x: number, y: number, z: number) => boolean;

        /**
         * Gets the position of a node
         * @param id of the node
         * @returns undefined or a JSON Object with x, y, z values
         */
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },

      scale: {
        /**
         * Sets the scale of a node
         * @param id of the node to scale
         * @param x of scale
         * @param y of scale
         * @param z of scale
         * @returns boolean true if successful
         */
        set: (id: number, x: number, y: number, z: number) => boolean;

        /**
         * Gets the scale of a node
         * @param id of the node
         * @returns undefined or a JSON Object with x, y, z values
         */
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },

      rotation: {
        /**
         * Sets the rotation of a node
         * @param id of the node to rotate
         * @param x of the quaternion rotation
         * @param y of the quaternion rotation
         * @param z of the quaternion rotation
         * @param w of the quaternion rotation
         * @returns boolean true if successful
         */
        set: (id: number, x: number, y: number, z: number, w: number) => boolean;

        /**
         * Gets the quaternion rotation of a node
         * @param id of the node
         * @returns undefined or a JSON Object with x, y, z, w values
         */
        get: (id: number) => ({ x: number, y: number, z: number, w: number } | undefined);
      },

      forward: {
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },
    }

    velocity: {
      /**
         * Sets the velocity of a Physics node
         * @param id of the node
         * @param x of velocity
         * @param y of velocity
         * @param z of velocity
         * @returns boolean true if successful
         */
      set: (id: number, x: number, y: number, z: number) => boolean;

      /**
       * Gets the velocity of a Physics node
       * @param id of the node
       * @returns undefined or a JSON Object with x, y, z values
       */
      get: (id: number) => ({ x: number, y: number, z: number } | undefined);
    }

    /**
     * Change the material properties of a mesh node
     */
    material: {
      /**
       * Adjust the color of the material
       */

      tintColor: {
        /**
         * Tint a material, any alpha lower than 1 will change the material to transparent
         * @param id of the node to affect
         * @param r of the color
         * @param g of the color
         * @param b of the color
         * @param a 1 is solid, anything less is transparent
         * @returns boolean true if successful
         */
        set: (id: number, r: number, g: number, b: number, a: number) => boolean;
        get: (id: number) => ({ r: number, g: number, b: number, a: number } | undefined);
      },

      /**
       * Change the emission color of a mesh node
       */
      emissionColor: {
        /**
         * Sets the emission color for a mesh, the color black disables emission
         * @param id of the mesh node
         * @param r of the color
         * @param g of the color
         * @param b of the color
         * @returns boolean true if successful
         */
        set: (id: number, r: number, g: number, b: number) => boolean;
        get: (id: number) => ({ r: number, g: number, b: number } | undefined);
      },

      /**
       * Change the emission strength of a mesh node
       */
      emissionStrength: {
        set: (id: number, value: number) => boolean;
        get: (id: number) => (number | undefined);
      },

      /**
       * The roughness of a mesh node, 0 none, 1 max
       */
      roughness: {
        set: (id: number, value: number) => boolean;
        get: (id: number) => (number | undefined);
      },

      /**
       * The metallic strength of a mesh node, 0 none, 1 max
       */
      metallic: {
        set: (id: number, value: number) => boolean;
        get: (id: number) => (number | undefined);
      },

      /**
       * Set the color of a pixel
       * @param id of the mesh node
       * @param mode to apply, where Linear blurs between pixels, and NearestNeighbor creates hard edges
       * @param useMipMaps set to true enables mipMaps
       * @returns boolean true if successful
       */
      setTextureDrawMode: (id: number, mode: 'Linear' | 'NearestNeighbor', useMipMaps: boolean) => boolean;
    }

    text: {
      display: {
        set: (id: number, text: string) => boolean,
        get: (id: number) => string | undefined,
      },

      fontSize: {
        set: (id: number, size: number) => boolean,
        get: (id: number) => number | undefined,
      },

      color: {
        set: (id: number, r: number, g: number, b: number) => boolean,
        get: (id: number) => { r: number, g: number, b: number } | undefined,
      },

      outline: {
        /**
         * Adjust the outline size of a text node
         * @param id of the text node
         * @param size of the outline (int values, ie. 0, 1, 2+)
         * @returns true if successful
         */
        set: (id: number, size: number) => boolean,
        get: (id: number) => number | undefined,
        color: {
          set: (id: number, r: number, g: number, b: number) => boolean,
          get: (id: number) => { r: number, g: number, b: number } | undefined,
        },
      },

      doubleSided: {
        set: (id: number, isDoubleSided: boolean) => boolean,
        get: (id: number) => boolean | undefined,
      },

      billboard: {
        set: (id: number, isEnabled: boolean) => boolean,
        get: (id: number) => boolean | undefined,
      },
    };

    audio: {
      /**
       * A stream must be set to play audio
       */
      stream: {
        setFromFilePath: (id: number, filePath: string) => boolean,
        setFromByteArray: (id: number, byteArray: Uint8Array | Int16Array, is16Bit: boolean) => boolean,
      },

      isPlaying: (id: number) => boolean,

      playFromStart: (id: number) => boolean,
      playFromPosInSeconds: (id: number, posInSeconds: number) => boolean,

      pause: (id: number) => boolean,
      resume: (id: number) => boolean,
      stop: (id: number) => boolean,

      currentPosInSeconds: {
        set: (id: number, posInSeconds: number) => boolean,
        get: (id: number) => number | undefined,
      },

      volume: {
        set: (id: number, volume: number) => boolean,
        get: (id: number) => number | undefined,
      },

      /**
       * Default is 1, under 1 reduces the pitch, 0 is invalid
       * Above 1 increases the pitch
       */
      pitch: {
        set: (id: number, pitch: number) => boolean,
        get: (id: number) => number | undefined,
      },

      /**
       * Spatial audio plays from the position of the node, non spatial
       * sounds like "global" audio in the users ears
       */
      spatial: {
        set: (id: number, isSpatial: boolean) => boolean,
        get: (id: number) => boolean | undefined,
      },

      /**
       * Sets the max distance the audio can be heard at
       * NOTE: this does not change the volume fall off rate (unitSize does that)
       * 
       * In general you likely want to adjust the unitSize in tandem
       */
      maxDistance: {
        set: (id: number, maxDistance: number) => boolean,
        get: (id: number) => number | undefined,
      },

      /**
       * Adjusts the volume fall off (it feels like changing the distance at which the audio is heard)
       * The smaller the unitSize, the faster the volume decreases, larger sizes extend the volume to greater distances
       * You can think of the volume going down at each unit distance (ie. 1m vs 5m)
       * 
       * In general you likely want to adjust the maxDistance in tandem
       * Though if you want a very hard volume fall off at the maxDistance, keeping unitSize large and shrinking maxDistance
       * can create the effect of being outside a building, and when you go in you can hear the audio loud again
       */
      unitSize: {
        set: (id: number, unitSize: number) => boolean,
        get: (id: number) => number | undefined,
      },

      /**
       * This adjusts how much spatial direction is perceived by the listener.
       * Eg. if you set the value to 1 and face your left ear at the audio source,
       * you will hear the audio at the intended volume in your left ear, but the right
       * ear will hear nothing. The default value is 0.95 (this makes it 100% in left ear,
       * 5% in right ear in the previous example). Setting to 0 makes it so both
       * ears hear the volume the same. This creates a global sound where only the
       * volume increase / decrease indicates that the audio is spatial. Not recommended
       * for most cases as it makes the audio not feel spatial but still takes the extra
       * processing power compared to non spatial "global" audio.
       * 
       * NOTE: has no effect on non spatial audio
       */
      panning: {
        set: (id: number, panning: number) => boolean,
        get: (id: number) => number | undefined,
      },

      /**
       * Adjusts the angle that the audio can be heard from, is off by default,
       * needs to be enabled and degrees set to be used.
       */
      emissionAngle: {
        enabled: {
          set: (id: number, enabled: boolean) => boolean,
          get: (id: number) => boolean | undefined,
        },
        degrees: {
          set: (id: number, degrees: number) => boolean,
          get: (id: number) => number | undefined,
        },

        /**
         * Decibel effect applied to the out of range area, the muffling effect.
         * 
         * Defaults to -24, values range from -80 to 0.
         */
        filter: {
          set: (id: number, db: number) => boolean,
          get: (id: number) => number | undefined,
        },
      },

      /**
       * Adjust the max number of times the audio can play over itself.
       * Useful for rapid sounds, eg. a projectile launch sfx.
       * 
       * Imagine setting to 4, you call playFromStart every 100ms, once 4 launch effects are already playing,
       * and you call playFromStart again, the first is stopped, and a new playback is started.
       * 
       * NOTE: because spatial audio allows for moving the audio playback position,
       * this does not work well for sfx played at multiple positions simultaneously.
       * In that case you will want to create multiple audio nodes (eg. a pool / array).
       * 
       * Defaults to 1, setting higher does make the play-pause APIs not work as intended
       */
      maxConcurrent: {
        set: (id: number, maxConcurrent: number) => boolean,
        get: (id: number) => number | undefined,
      },

      /**
       * Allows you to set what bus the audio is played from
       * 
       * Eg. a "echo" audio bus could add reverb, etc.
       * 
       * NOTE: there is currently no way to create custom busses, and only "Master" exists
       */
      bus: {
        set: (id: number, bus: string) => boolean,
        get: (id: number) => string | undefined,
      },

      // We do not currently have a way to create a new Area3D Layer (or the ability to assign an audio bus to it)
      // But once we do, this could allow you to make sounds heard/played (not sure) have an effect applied
      // As an example a cathedral could sound echoey, or underwater could sound garbled
      areaMask: {
        set: (id: number, areaMaskID: number) => boolean,
        get: (id: number) => number | undefined,
      },
    };

    /**
     * Destroys a given node and its children
     * @param id of the node to destroy
     * @returns boolean true if id was found and node was destroyed
     */
    destroy: (id: number) => boolean;
  }


  const skyDome: {
    ambientLight: {
      /**
       * Color of the ambient light in the world.
       */
      baseColor: {
        set: (r: number, g: number, b: number) => boolean;
        get: () => ({ r: number, g: number, b: number } | undefined);
      },
      /**
       * Increase or decrease the brightness of the scene. Defaults to 1.
       */
      energy: {
        set: (value: number) => boolean;
        get: () => (number | undefined);
      },
      /**
       * Allows the sky color to cast colored light on the scene (from above and below).
       * Values range from 0 (no contribution) to 1 (max contribution). Defaults to 0.
       */
      skyColorContribution: {
        set: (value: number) => boolean;
        get: () => (number | undefined);
      },
    };
    skyMaterial: {
      /**
       * Updates the Procedural Sky Material, or creates one if it doesn't already exist. Undefined values are skipped.
       * @param topColor Sky Color
       * @param topHorizonColor Best to match bottomHorizonColor
       * @param topCurve How sharply the top and horizon colors fade together
       * @param bottomColor Ground Color
       * @param bottomHorizonColor Best to match topHorizonColor
       * @param bottomCurve How sharply the bottom and horizon colors fade together
       * @returns boolean true if successful
       */
      setProceduralSkyMaterial: (
        topColor: { r: number, g: number, b: number } | undefined,
        topHorizonColor: { r: number, g: number, b: number } | undefined,
        topCurve: number | undefined,
        bottomColor: { r: number, g: number, b: number } | undefined,
        bottomHorizonColor: { r: number, g: number, b: number } | undefined,
        bottomCurve: number | undefined,
      ) => boolean;
    };
  }

  const localPlayer: {
    position: {
      set: (x: number, y: number, z: number) => boolean;
      get: () => ({ x: number, y: number, z: number } | undefined);
    },
    rotation: {
      set: (x: number, y: number, z: number, w: number) => boolean;
      get: () => ({ x: number, y: number, z: number, w: number } | undefined);
    },
    forward: {
      get: () => ({ x: number, y: number, z: number } | undefined);
    },
    up: {
      get: () => ({ x: number, y: number, z: number } | undefined);
    },
    right: {
      get: () => ({ x: number, y: number, z: number } | undefined);
    },

    head: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
    body: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
    leftHand: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
    rightHand: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
    foot: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
  }

  const keyboard: {
    /**
     * Shows the keyboard
     * @param defaultText to start from, you can also use an empty string 
     * @returns boolean true if successful
    */
    show: (defaultText: string) => boolean;

    /**
     * Hides the keyboard
     * @returns boolean true if successful
    */
    hide: () => boolean;

    // Need callback for when keyboard is closed

    clipboard: {
      set: (text: string) => boolean;
      get: () => (string | undefined);
    }
  }

  const networking: {
    socket: {
      /**
       * Create a new socket connection, can be used as a client or remote peer
       * @returns number id of the "WebSocketPeer"
       */
      create: () => number;

      /**
       * Closes a socket connection
       * @param id to close
       * @returns boolean true if successful
       */
      close: (id: number) => boolean;

      /**
       * Connect a socket to a url
       * @param id of the socket
       * @param url to connect to
       * @returns boolean true if the socket was found
       */
      connectToURL: (id: number, url: string) => boolean;

      /**
       * Updates connection state and receives incoming packets. Call regularly to keep it in a clean state.
       * @param id of the socket
       * @returns boolean true if the socket was found
       */
      poll: (id: number) => boolean;

      /**
       * Checks the socket to see if the ready state is open
       * @param id of the socket
       * @returns boolean true if the get ready state is open
       */
      isSocketOpen: (id: number) => boolean;

      /**
       * Sends a message
       * @param id of the socket
       * @param msg to send
       * @returns boolean true if the socket was found and open
       */
      sendText: (id: number, msg: string) => boolean;

      /**
       * Get available packets (once gotten, they are removed from the queue)
       * @param id of the socket
       * @returns string[] of available packets
       */
      getPackets: (id: number) => string[];
    },

    /**
     * WebRTCPeerConnection is not thread safe and needs to be run on the main thread (ie. no async)
     */
    rtcPeer: {
      create: () => number;

      close: (id: number) => boolean;

      poll: (id: number) => boolean;

      state: (id: number) => ('New' | 'Connecting' | 'Connected' | 'Disconnected' | 'Closed' | 'Failed') | undefined;

      getOffer: (id: number) => { type: string, sdp: string } | undefined;

      setRemoteDescription: (id: number, type: string, sdp: string) => boolean;

      // sendText: (id: number, msg: string) => boolean;

      // getPackets: (id: number) => string[];
    },

    http: {
      getJSON: <T = unknown>(host: string, path: string) => T | undefined;

      /**
       * Download a zip from a url over http and save it to a folder with a given name
       * Note: slow connections will time out after 10 seconds and fail
       * @param hostURL domain to download from
       * @param pathURL on the hostURLs domain to download from
       * @param fileName to use without extension (ie. 'File_Name')
       * @param folderPath to save the zip into
       * @returns boolean true if successful
       */
      downloadZipToFolder: (hostURL: string, pathURL: string, fileName: string, folderPath: string) => boolean;
    },
  }

  /**
   * Fire a raycast from a pos, towards a destination, returns undefined if error or nothing was hit.
   * If hitting a concave shape with a texture and getUVs is set to true, UV coordinates will be calculated.
   * 
   * Return values of -1 will be used if no available data for nodeID, uvX, and uvY
   */
  const raycast: (posX: number, posY: number, posZ: number, destX: number, destY: number, destZ: number, getUVsFromMeshNodeID: number) => { hitPosX: number, hitPosY: number, hitPosZ: number, normalX: number, normalY: number, normalZ: number, nodeID: number, uvX: number, uvY: number } | undefined;

  const shader: {
    applyToMesh: (meshNodeID: number, shaderCode: string) => boolean;
    removeFromMesh: (meshNodeID: number) => boolean;
    updateNumber: (meshNodeID: number, parameterName: string, value: number) => boolean;
    updateColor: (meshNodeID: number, parameterName: string, r: number, g: number, b: number) => boolean;
  }
}
