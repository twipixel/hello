package { 
    import flash.display.* 
    import flash.events.*; 
    import flash.net.URLRequest; 
    public class ImageLoader extends Sprite { 
        public var url:String; 
        public var bitmap:Bitmap; 
    public function ImageLoader(loc:String = null) { 
        if (loc != null){ 
            url = loc; 
            loadImage(); 
        } 
    } 
    public function loadImage():void{ 
        if (url != null){ 
            var loader:Loader = new Loader(); 
            loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onComplete); 
            loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, onIoError); 
             
                var req:URLRequest = new URLRequest(url); 
                loader.load(req); 
            } 
        } 
         
    private function onComplete(event:Event):void { 
            var loader:Loader = Loader(event.target.loader); 
            var info:LoaderInfo = LoaderInfo(loader.contentLoaderInfo); 
            this.bitmap = info.content as Bitmap; 
            this.dispatchEvent(new Event(Event.COMPLETE)); 
    } 
         
    private function onIoError(event:IOErrorEvent):void { 
            trace("onIoError: " + event); 
    } 
    } 
}