const app = document.getElementById("app");
let romData = null;


const androidLogos = {
    "11": "/images/A11.png",
    "12": "/images/A12.png",
    "13": "/images/A13.png",
    "14": "/images/A14.png",
    "15": "/images/A15.png",
    "16": "/images/A16.png"
};


const devices = {
    lancelot: {
        name: "Redmi 9 Lancelot",
        image: "/images/lancelot.png"
    },
    merlinx: {
        name: "Redmi Note 9 Merlinx",
        image: "/images/merlinx.png"
    }
};

async function loadROMData() {
    const res = await fetch("rom.json");
    romData = await res.json();
}

loadROMData().then(() => showDeviceSelection());

function showDeviceSelection() {
    app.innerHTML = `
        <div class="device-container">
            ${Object.keys(devices).map(id => `
                <div class="device-card" onclick="showDeviceInfo('${id}')">
                    <img src="${devices[id].image}" alt="${devices[id].name}">
                    <h2>${devices[id].name}</h2>
                </div>
            `).join("")}
        </div>
    `;
}

function showDeviceInfo(device) {
    let romTypes = new Set();

    for (let romKey in romData.roms) {
        const rom = romData.roms[romKey];

        for (let vKey in rom.versions) {
            const build = rom.versions[vKey];
            if (build.downloads[device]) {
                romTypes.add(romKey); 
            }
        }
    }

    app.innerHTML = `
        <button class="back-btn" onclick="showDeviceSelection()">← Back</button>
        <h2>${devices[device].name}</h2>
        <p>Select ROM type</p>

        <div class="rom-grid">
            ${Array.from(romTypes).map(id => `
                <div class="rom-card" onclick="showROMVersions('${device}', '${id}')">
                    <img src="${romData.roms[id].image}" class="rom-image">
                    <h3>${romData.roms[id].rom_name}</h3>
                </div>
            `).join("")}
        </div>
    `;
}

function showROMVersions(device, romKey) {
    const rom = romData.roms[romKey];
    const versions = [];

    for (let vKey in rom.versions) {
        const build = rom.versions[vKey];

        if (build.downloads[device]) {
            versions.push({
                name: vKey,
                android: build.android_version,
                buildDate: build.downloads[device].build_date,
                link: build.downloads[device].url,
                size: build.downloads[device].size,
                status: build.downloads[device].status
            });
        }
    }

    app.innerHTML = `
        <button class="back-btn" onclick="showDeviceInfo('${device}')">← Back</button>
        <h2>${rom.rom_name}</h2>
        <p>Select build version</p>

        <div class="version-list">
            ${versions.map(v => {
                let statusColor;
                if (v.status.toLowerCase() === "official") statusColor = "green";
                else if (v.status.toLowerCase() === "unofficial") statusColor = "red";
                else if (v.status.toLowerCase() === "discontinued") statusColor = "yellow";
                else statusColor = "white";

                return `
                <div class="version-item">
                    <div class="version-info">
                        <h3>${v.name} <span style="color:${statusColor}">(${v.status})</span></h3>
                        <p>Android: ${v.android}</p>
                        <p>Build Date: ${v.buildDate}</p>
                        <p>Size: ${v.size}</p>
                        <a href="${v.link}" class="download-btn">Download</a>
                    </div>
                    <img src="${androidLogos[v.android] || ''}" 
                         alt="Android ${v.android}" 
                         class="android-logo-big">
                </div>
                `;
            }).join("")}
        </div>
    `;
}