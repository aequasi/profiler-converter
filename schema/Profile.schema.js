module.exports = {
    id:          "/Profile",
    title:       "Profile",
    description: "A profile inside ProfileData",
    type:        "object",
    properties:  {
        Hotspots: {
            type:        "array",
            description: "Hotspots for this profile",
            items:       {$ref: "/Hotspot"}
        },
        VendorHotspots: {
            type:        "array",
            description: "Vendor Hotspots for this profile",
            items:       {$ref: "/Hotspot"}
        },
        Blacklist: {
            type:        "array",
            description: "Blacklist spots for this profile",
            items:       {$ref: "/Hotspot"}
        },
        Repair: {
            type:        "array",
            description: "Repair Hotspots for this profile",
            items:       {$ref: "/Hotspot"}
        },
        MobList: {
            type:        "array",
            description: "Mobs for this profile",
            items:       {$ref: "/Mob"}
        },
    }
};
