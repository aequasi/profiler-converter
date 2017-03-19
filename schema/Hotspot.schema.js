module.exports = {
    id:          "/Hotspot",
    title:       "Hotspot",
    description: "A hotspot inside ProfileData",
    type:        "object",
    properties:  {
        X: {
            type:        "float",
            description: "X Position"
        },
        Y: {
            type:        "float",
            description: "Y Position"
        },
        Z: {
            type:        "float",
            description: "Z Position"
        },
        Type: {
            type:        "string",
            description: "Type of hotspot"
        },
        Name: {
            type:        "string",
            description: "Name of interest at hotspot"
        },
        Metadata: {
            type:        "string",
            description: "Extra Metadata"
        },
    },
    required: ["X", "Y", "Z"]
};
