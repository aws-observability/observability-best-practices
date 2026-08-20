import sched, time, sys, argparse
from kubernetes import client, config, watch

#Config varables
INITIAL_DELAY_IN_SECONDS = 1

#Load K8s cluster configuration
config.load_incluster_config()

#Get api client
v1 = client.CoreV1Api()

#Block to get the pod events
def lookup_all_events():
    for event in watch.Watch().stream(v1.list_event_for_all_namespaces,timeout_seconds=3):
           print( "%s: Namespace: %s,Object: %s,Name: %s,Reason: %s,Message: %s" % ( event["raw_object"]["kind"],event["raw_object"]["metadata"]["namespace"],event["raw_object"]["involvedObject"]["kind"],event["raw_object"]["involvedObject"]["name"],event["raw_object"]["reason"],event["raw_object"]["message"]))

#Block to get the pod events
def lookup_pod_events():
    for event in watch.Watch().stream(v1.list_pod_for_all_namespaces, timeout_seconds=3):
           print( "%s %s %s" % ( event["type"],event["object"].kind,event["object"].metadata.name)) 

#Block to get the node events
def lookup_node_events():
    for event in watch.Watch().stream(v1.list_node, timeout_seconds=3):
           print( "%s %s %s" % ( event["type"],event["object"].kind,event["object"].metadata.name)) 
  
#Block to get namespace events
def lookup_ns_events():
    for event in watch.Watch().stream(v1.list_namespace, timeout_seconds=3):
           print( "%s %s %s" % ( event["type"],event["object"].kind,event["object"].metadata.name)) 
  
#Block to get service events
def lookup_service_events():
    for event in watch.Watch().stream(v1.list_service_for_all_namespaces, timeout_seconds=3):
           print( "%s %s %s" % ( event["type"],event["object"].kind,event["object"].metadata.name)) 

#Block to get pvc events
def lookup_pvc_events():
    for event in watch.Watch().stream(v1.list_persistent_volume_claim_for_all_namespaces, timeout_seconds=3):
           print( "%s %s %s" % ( event["type"],event["object"].kind,event["object"].metadata.name)) 


def lookup_events(sc):
    if "event" in optionsList:
        #Get all events
        lookup_all_events()
    if "pod" in optionsList:
        #Get pod events
        lookup_pod_events()
    if "namespace" in optionsList:
        #Get namespace events
        lookup_ns_events()
    if "node" in optionsList:
        #Get node events
        lookup_node_events()
    if "service" in optionsList:
        #Get service events
        lookup_service_events()
    if "pvc" in optionsList:
        #Get pvc events
        lookup_pvc_events()
    
    #Rinse and repeat       
    s.enter(timerFrequencyInseconds, 1, lookup_events, (sc,))

    
    
#Start here
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-interval", "--timerfrequencyInSeconds", dest ="frequencySeconds", default = 3600, type=int, help="Event Fetch Frequency in seconds")
    parser.add_argument("-list", "--optionsList", dest = "optionsList", default = "event,pod,node,namespace,service,pvc", help="List of object options")
    args = parser.parse_args()
    global optionsList 
    optionsList= args.__dict__["optionsList"]
    global timerFrequencyInseconds
    timerFrequencyInseconds=args.__dict__["frequencySeconds"]
    print("Event watcher started for objects "+optionsList+" with interval "+str(timerFrequencyInseconds))
    
    #Initialize the scheduler
    s = sched.scheduler(time.time, time.sleep)
    s.enter(INITIAL_DELAY_IN_SECONDS, 1, lookup_events, (s,))
    s.run()
