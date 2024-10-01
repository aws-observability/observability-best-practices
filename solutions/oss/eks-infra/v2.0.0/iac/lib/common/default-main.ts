import { EmptyStack, configureApp } from "./construct-utils";

const app = configureApp();

new EmptyStack(app, "To work with patterns use:",
    "$ make list # to list all patterns",
    "$ make pattern <pattern-name> <list | deploy | synth | destroy>",
    "Example:",
    "$ make pattern single-new-eks-cluster-opensource deploy");