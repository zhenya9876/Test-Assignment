try
{
    observerService = Components.classes["@mozilla.org/observerservice;1"].getService(Components.interfaces.nsIObserverService);
    observerService.addObserver(myObserver, "TeletecSTB", false);
}catch(e)
{}