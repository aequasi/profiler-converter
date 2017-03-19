module.exports = {
    id:          "/Mob",
    title:       "Mob",
    description: "A Mob inside ProfileData",
    type:        "object",
    properties:  {
        ID: {
            type:        "integer",
            description: "ID of mob"
        },
        Name: {
            type:        "string",
            description: "Name of mob"
        },
        Ignore: {
            type: "boolean",
            description: "Whether to ignore the mod",
            default: false
        }
    }
};
