��    H      \  a   �         �   !  �   �  �   �  &   z  Q   �  D   �  N   8	  5   �	     �	     �	     �	  _   
  J   b
     �
     �
  S   �
  C   +  /   o  H   �  o   �     X  9   i  �   �  ]   R     �  ^   �     &     E     Y  }   p  �   �  �   �  �   M  �     h   �  	   5  &   ?  1   f     �      �  #   �  W   �  0   A  E   r      �  ?   �  *        D     `  �   }  �    t   �  a  V  &   �  ;   �  8     2   T  A   �  :   �  ~     |   �  @         A  �   W     @  |   V  /   �  F        J  �  \  '      �  )   �   �!  �   q"  �   H#  '   $  R   G$  <   �$  K   �$  5   #%  "   Y%     |%     �%  g   �%  K   &     W&     o&  Q   �&  D   �&  %   '  K   >'  �   �'     (  C   (  �   a(  l   )     �)  b   �)     �)     *     .*     A*  �   �*  �   g+  �   ,  �   �,  z   �-     .  '   .  7   C.     {.  !   �.  #   �.  c   �.  6   2/  C   i/  $   �/  C   �/  .   0     E0     a0  �   ~0  �  1  w   �3  �  \4  -   �5  A   6  >   M6  >   �6  ?   �6  2   7  �   >7  }   �7  H   C8     �8  �   �8     �9  t   �9  2   :  I   P:     �:  �  �:  (   Y<        &   8       (   %   :       6                 )            <              G   D       H   +   1   -             ,       '             C   *          7      =   ?       #   E           @                      9   4   2             0   5                "   ;              /      $          >   	             A      B   .       !         F   3          
    %d of %d selected photos are <strong>private photos</strong>, and they are not recommended for permanent linking (embedding). Private photo URLs may be changed by the Photos app at any time. <br>Photo URLs: with prefix 'photo' <strong>/photo/photo_url/</strong>, e.g. /photo/DSC_2051/<br>Album URLs: without prefix 'album' <strong>/&lt;full_path_to_album&gt;/</strong>, e.g. /travel/france/2010/ <br>Photo URLs: without prefix 'photo' <strong>/photo_url/</strong>, e.g. /DSC_2051/<br>Album URLs: with prefix 'album' <strong>/album/&lt;full_path_to_album&gt;/</strong>, e.g. /album/travel/france/2010/ Album is visible in the public gallery Album is visible only to authorized users of the Photos app, or by a private link Album is visible only to authorized users of the Webasyst Photos app All photos will remain in the photo stream, and only the album will be deleted Allow on demand generation of custom-sized thumbnails Are you sure to delete photo? Are your shure? Backup photo originals Core content loaded according to the requested resource: a blog post, post stream, a page, etc. Dynamic album based on search criteria, e.g. rating, album hierarchy, tags Edit photos description Editors’ choice Failed to upload. Most probably, there were not enough memory to create thumbnails. Files with extensions *.gif, *.jpg, *.jpeg, *.png are allowed only. For embedding into other Webasyst apps content. Get photos list by search conditions e.g. tag/my_tag, album/12, id/1,5,7 Get single photo by numerical id (photo_id) with specified size (numerical or size name e.g. big, middle, crop) Hide photos name Hooks to this page. Below are describe keys of this param If enabled, frontend design theme can request Photos app to create custom-sized photo thumbnails on fly (any size in addition to the listed above, including cropped versions) Image URLs of private photos are temporary. Permanent linking (embedding) is not recommended. Latest uploaded photos Limits the maximum thumbnail size that can be created on demand. Must not be less than 970 px. Name the album for this upload No one album exists Not choosen any photos One or more optional custom params, setted by album settings in backend in key-value format, i.e. available like {$album.key} Only authorized users of the Webasyst Photos app can see these photos. Photos can be shared via sending a secure private link, or via embedded into external websites and apps Only authorized users of the Webasyst Photos app can see these photos. Photos can be shared via sending a secure private link, or via embedded into external websites and apps. Optional set of custom <em>key=value</em> parameters which can be used within a frontend's theme template as <em>&#123;$album.key&#125;</em>. Each key=value pair should be on a separate line Optional set of custom <em>key=value</em> parameters which can be used within a frontend's theme template as <em>&#123;$album.key&#125;</em>. Each key=value pair should be on a separate line. Optional var. Available only if current context of photo is album. Below are describe keys of this param Originals Photo is visible in the public gallery Photos automatically appear in the public gallery Photostream Please select at least two photo Plugin %s is installed and working. Plugin order defines the order they are executed. Sort plugin list to change the order. Rendered HTML block of current photo author info Rendered HTML block of links to albums which current photo belongs to Rendered html block of exif info Rendered html block of links' to album in where is curret photo Rendered html block of photo's author info Rendered html block of tags Rendered photo-stream widget Returns entire tag list as an array with the following structure: (<em>"id"</em>, <em>"name"</em>, <em>"count"</em>, <em>"size"</em>, <em>"opacity"</em>) Returns photo by id (<em>photo_id</em>) as an array with the following structure: (<em>"id"</em>, <em>"name"</em>, <em>"description"</em>, <em>"ext"</em>, <em>"size"</em>, <em>"type"</em>, <em>"rate"</em>, <em>"width"</em>, <em>"height"</em>, <em>"contact_id"</em>, <em>"upload_datetime"</em>, <em>"edit_datetime"</em>, <em>"status"</em>, <em>"hash"</em>, <em>"url"</em>, <em>"parent_id"</em>, <em>"stack_count"</em>, <em>"sort"</em>, <em>"thumb_%size%"</em>). Optional <em>size</em> parameter can be used to fetch particular thumbnail size: should be provided in pixels, or as one of the predefined values: <em>"big"</em> for 970, <em>"middle"</em> for 750, <em>"thumbs"</em> for 200x0, <em>"crop"</em> for 96x96 Returns photo list array by search criteria, e.g. <em>"tag/vacations"</em>, <em>"album/12"</em>, <em>"id/1,5,7"</em> Returns photo list array by search criteria, e.g. <em>"tag/vacations"</em>, <em>"album/12"</em>, <em>"id/1,5,7"</em>. <em>size</em> parameter indicates thumbnail size. <em>limit</em> parameter is MySQL-like: can be either a number (max number of photos to be returned) or a pair of offset, limit (start from and the max number of records to be returned) See description of vars for photo.html Select user groups you want to have access to these photos: Select user groups you want to have access to this album Select user groups you want to have see this album Static album which allows adding and arranging photos in manually The insufficient file write permissions for the %s folder. The way to use album custom parameters which can be set for every individual album in its settings (<em>key=value</em> format) There are no user groups in your Webasyst installation. Add groups in the Contacts app to be able to manage access to photos There are no user groups thus you cant't manage access to photos This album is private This album will not be visible in the public gallery because there are no routing rules for the Photos app in your website settings. Use Site app (Routing section) to settle Photos app on your website and to start publishing photos. This photo is private This will reset all changes you applied to the image after upload, and will restore the image to its original. Are you sure? Thumbnails to be created when photo is uploaded Unsaved changes will be lost if you leave this page now. Are you sure? Url to next photo When enabled, every uploaded image file is automatically backed up and stored independently from photo full size version, which is modified when you edit it, e.g. rotate, apply watermarks or image visual effects. Originals are never updated. Pros: you have backups of all uploaded images. Cons: almost twice more disk space is required for storing original images than for storing only full size versions and thumbnails. You don't have sufficient access rights Project-Id-Version: photos
POT-Creation-Date: 2012-06-27 11:16+0400
PO-Revision-Date: 
Last-Translator: 
Language-Team: photos
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
X-Poedit-SourceCharset: utf-8
X-Poedit-Basepath: .
X-Generator: Poedit 1.6.3
Plural-Forms: nplurals=2; plural=(n != 1);
Language: en_US
X-Poedit-SearchPath-0: .
X-Poedit-SearchPath-1: .
 %d of %d selected photos are <strong>private</strong>, they are not recommended for permanent linking (embedding). Private photo URLs may be changed by the Photos app at any time. <br>Photo URLs: with the 'photo' prefix <strong>/photo/photo_url/</strong>; e.g., /photo/DSC_2051/<br>Album URLs: without the 'album' prefix <strong>/&lt;full_path_to_album&gt;/</strong>; e.g., /travel/france/2010/ <br>Photo URLs: without the 'photo' prefix <strong>/photo_url/</strong>; e.g., /DSC_2051/<br>Album URLs: with the 'album' prefix <strong>/album/&lt;full_path_to_album&gt;/</strong>; e.g., /album/travel/france/2010/ Album is visible in the public gallery. Album is visible only to authorized users of the Photos app or via a private link. Album is visible only to authorized users of the Photos app. Only the album will be deleted. All photos will remain in the photo stream! Allow on-demand generation of custom-sized thumbnails Are you sure to delete this photo? Are your sure? Back up original photos Core content loaded in accordance with the requested resource: a blog post, a post stream, a page, etc. Dynamic album based on search criteria; e.g., rating, album hierarchy, tags Edit photo descriptions Editor’s choice Failed to upload. Most probably there was not enough memory to create thumbnails. Only files with name extensions .gif, .jpg, .jpeg, .png are allowed. For embedding in other Webasyst apps. Get a photo list by search conditions; e.g., tag/my_tag, album/12, id/1,5,7 Get a single photo by its numerical id (photo_id) with the specified size (numerical value or size name; e.g., big, middle, crop) Hide photo names Hooks to this page. Below are described the keys of this parameter. If enabled, frontend design theme can request Photos app to create custom-sized photo thumbnails on the fly (any size in addition to those listed above including cropped versions). Image URLs of private photos are temporary values and are not recommended for permanent linking (embedding). Last uploaded photos Limits the maximum thumbnail size, which can be created on demand. Should not be less than 970 px. Enter the name of a new album There are no albums. No photos selected One or more optional custom parameters specified in album settings in the key=value format, which are available as {$album.key} Only authorized users of the Photos app can see these photos. Photos can be shared by sending a secure private link or can be embedded in external websites and apps. Only authorized users of the Photos app can see these photos. Photos can be shared by sending a secure private link or can be embedded in external websites and apps. Optional set of custom <em>key=value</em> parameters which can be used in frontend theme templates as <em>&#123;$album.key&#125;</em>. Each key=value pair must be specified on a separate line. Optional set of custom <em>key=value</em> parameters, which can be used in frontend theme templates as <em>&#123;$album.key&#125;</em>. Each key=value pair must be specified on a separate line. Optional variable. Available only if the current context is a photo album. Below are described the keys of this parameter. Original photos Photo is visible in the public gallery. Photos will automatically appear in the public gallery. Photo stream Please select at least two photos Plugin %s is installed and enabled. Plugins' positions in the list define their execution order. Re-sort the list to change this order. Rendered HTML block of the current photo's author info Rendered HTML block of links to albums containing the current photo Rendered HTML block of the EXIF info Rendered HTML block of links to albums containing the current photo Rendered HTML block of the photo's author info Rendered HTML block of tags Rendered photo stream widget Returns entire tag list as an array with the following structure: (<em>"id"</em>, <em>"name"</em>, <em>"count"</em>, <em>"size"</em>, <em>"opacity"</em>) Returns a photo by its id (<em>photo_id</em>) as an array with the following structure: (<em>"id"</em>, <em>"name"</em>, <em>"description"</em>, <em>"ext"</em>, <em>"size"</em>, <em>"type"</em>, <em>"rate"</em>, <em>"width"</em>, <em>"height"</em>, <em>"contact_id"</em>, <em>"upload_datetime"</em>, <em>"edit_datetime"</em>, <em>"status"</em>, <em>"hash"</em>, <em>"url"</em>, <em>"parent_id"</em>, <em>"stack_count"</em>, <em>"sort"</em>, <em>"thumb_%size%"</em>). Optional <em>size</em> parameter can be used to fetch a particular thumbnail size, if specified in pixels or as one of the predefined values: <em>"big"</em> for 970, <em>"middle"</em> for 750, <em>"thumbs"</em> for 200x0, <em>"crop"</em> for 96x96. Returns a photo list array by search criteria; e.g., <em>"tag/vacations"</em>, <em>"album/12"</em>, <em>"id/1,5,7"</em> Returns a photo list array by search criteria; e.g., <em>"tag/vacations"</em>, <em>"album/12"</em>, <em>"id/1,5,7"</em>. <em>size</em> parameter indicates thumbnail size. The <em>limit</em> parameter is similar to that used in SQL: it can be either a number (max number of photos to be returned) or a pair of offset and limit (start from and the max number of records to be returned). See the variables descriptions for photo.html Select user groups which you want to have access to these photos: Select user groups which you want to have access to this album Select user groups which you want to have access to this album Static album which allows manual adding and arranging of photos Insufficient file write permissions for folder %s. The way to use custom album parameters which can be set for every individual album in its settings (in the <em>key=value</em> format). There are no user groups in your Webasyst installation. Add groups in the Contacts app to be able to manage access to photos. There are no user groups; therefore, you cannot manage access to photos. This album is private. This album will not be visible in the public gallery, because there are no routing rules for the Photos app in your website settings. Use Site app (Routing section) to settle the Photos app on your website and to start publishing photos. This photo is private. This will reset all changes you applied to the image after upload and will restore the original image. Are you sure? Thumbnails to be created for newly uploaded photos Non-saved changes will be lost, if you leave this page now. Are you sure? URL of the next photo When enabled, every uploaded image file is automatically backed up and stored independently of the photo's full-size version, which is modified when you edit it; e.g., rotate, apply watermarks or image visual effects. Original images are never updated. Pros: you have backups of all uploaded images. Cons: almost twice as much disk space is required to store original images in addition to full-size versions and thumbnails. You don't have sufficient access rights. 