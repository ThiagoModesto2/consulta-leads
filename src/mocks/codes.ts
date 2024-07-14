import { generateUniqueCode } from "../utils/generateUniqueCode";

export const existingCodes = new Set<string>();

const codesData = [
    {
        id: 1,
        name: "Rock in Rio",
        image: "/codes/rock-in-rio.png",
        code: "",
        price: 83.00
    },
    {
        id: 2,
        name: "Heineken",
        image: "/codes/heineken.png",
        code: "",
        price: 36.00
    },
    {
        id: 3,
        name: "Stanley",
        image: "/codes/stanley.jpeg",
        code: "",
        price: 73.00
    },
    {
        id: 4,
        name: "Seleção Brasileira",
        image: "/codes/cbf-logo-selecao-logo-brasil.png",
        code: "",
        price: 73.00
    },
    {
        id: 5,
        name: "Rede Globo",
        image: "/codes/Rede_Globo_logo.png",
        code: "",
        price: 83.00
    },
    {
        id: 6,
        name: "Coca Cola",
        image: "/codes/coca-cola.png",
        code: "",
        price: 65.00
    },
    {
        id: 7,
        name: "Volkswagen",
        image: "/codes/Volkswagen-logo-2000-1920x1080.png",
        code: "",
        price: 83.00
    },
    {
        id: 8,
        name: "Casas Bahia",
        image: "/codes/2560px-Casas_Bahia_logo.svg.png",
        code: "",
        price: 83.00
    },
];

codesData.forEach(item => {
    item.code = generateUniqueCode(existingCodes);
});

export default codesData;