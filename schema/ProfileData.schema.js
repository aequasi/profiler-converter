module.exports = {
    id:          "/ProfileData",
    title:       "ProfileData",
    description: "A profile for the Vanilla WoW Bot: ZzukBot",
    type:        "object",
    properties:  {
        Name:    {
            type:        "string",
            description: "Name of the profile"
        },
        Type:    {
            type:        "string",
            description: "Type of the profile"
        },
        Profile: {
            $ref:        "/Profile",
            description: "The actual profile"
        }
    },
    required:    ["Name", "Type", "Profile"]
};
