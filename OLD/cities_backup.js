// São Paulo state cities
const saoPauloCities = [
    "Adamantina", "Adolfo", "Aguaí", "Águas da Prata", "Águas de Lindóia", "Águas de Santa Bárbara", "Águas de São Pedro", "Agudos", "Alambari", "Alfredo Marcondes", "Altair", "Altinópolis", "Alto Alegre", "Alumínio", "Álvares Florence", "Álvares Machado", "Alvaro de Carvalho", "Alvinlândia", "Americana", "Américo Brasiliense", "Américo de Campos", "Andradina", "Angatuba", "Anhembi", "Anhumas", "Aparecida", "Aparecida d'Oeste", "Apiaí", "Araçariguama", "Araçatuba", "Araçoiaba da Serra", "Arandu", "Arapeí", "Araraquara", "Araras", "Arco-Íris", "Arealva", "Areias", "Areiópolis", "Ariranha", "Artur Nogueira", "Arujá", "Aspásia", "Assis", "Atibaia", "Auriflama", "Avaí", "Avanhandava", "Avaré", "Bady Bassitt", "Balbinos", "Bálsamo", "Bananal", "Barão de Antonina", "Barbosa", "Bariri", "Barra Bonita", "Barra do Chapéu", "Barra do Turvo", "Barretos", "Barrinha", "Barueri", "Bastos", "Batatais", "Bauru", "Bebedouro", "Belo Monte", "Bertioga", "Bilac", "Birigui", "Boa Esperança do Sul", "Bofete", "Boituva", "Bom Jesus dos Perdões", "Bom Sucesso de Itararé", "Borá", "Boracéia", "Borebi", "Botucatu", "Bragança Paulista", "Braúna", "Brejo Alegre", "Brodowski", "Brotas", "Buri", "Buritama", "Buritizal", "Cabrália Paulista", "Cabreuva", "Caçapava", "Cachoeira Paulista", "Caconde", "Cafelândia", "Caiabu", "Caieiras", "Caiuá", "Cajamar", "Cajati", "Cajuru", "Campina do Monte Alegre", "Campinas", "Campo Limpo Paulista", "Campos do Jordão", "Campos Novos Paulista", "Cananéia", "Canas", "Cândido Mota", "Cândido Rodrigues", "Canitar", "Capela do Alto", "Capivari", "Caraguatatuba", "Carapicuíba", "Cardoso", "Casa Branca", "Castrinópolis", "Catanduva", "Catiguá", "Cedral", "Cerqueira César", "Cerquilho", "Cesário Lange", "Charqueada", "Chavantes", "Clementina", "Colina", "Colômbia", "Conchal", "Conchas", "Cordeirópolis", "Coroados", "Coronel Macedo", "Corumbataí", "Cosmorama", "Cosmópolis", "Cotia", "Cravinhos", "Cristais Paulista", "Cruzália", "Cruzeiro", "Cubatão", "Cunha", "Descalvado", "Díade", "Dirce Reis", "Divinolândia", "Dolcinópolis", "Dourado", "Dracena", "Duartina", "Dumont", "Echaporã", "Eldorado", "Elias Fausto", "Elisiário", "Embaúba", "Embu das Artes", "Embu-Guaçu", "Emilianópolis", "Engenheiro Coelho", "Espírito Santo do Pinhal", "Espírito Santo do Turvo", "Estiva Gerbi", "Estrela d'Oeste", "Estrela do Norte", "Euclides da Cunha Paulista", "Fartura", "Fernandópolis", "Fernando Prestes", "Ferraz de Vasconcelos", "Florida Paulista", "Florínia", "Flórida Paulista", "Franca", "Francisco Morato", "Franco da Rocha", "Gabriel Monteiro", "Gália", "Garça", "Gastão Vidigal", "Gavião Peixoto", "General Salgado", "Getulina", "Glicério", "Guaimbê", "Guaíra", "Guaraci", "Guarani d'Oeste", "Guarantã", "Guararapes", "Guaraqueçaba", "Guaratinguetá", "Guareí", "Guariba", "Guarulhos", "Guatapará", "Guzolândia", "Herculândia", "Hortolândia", "Iacanga", "Iacri", "Iaras", "Ibaté", "Ibirá", "Ibirarema", "Ibitinga", "Ibiúna", "Icém", "Iepê", "Igarapava", "Igaratá", "Iguape", "Iiacara", "Ilha Comprida", "Ilha Solteira", "Ilhabela", "Indaiatuba", "Indiana", "Indiaporã", "Inúbia Paulista", "Ipaussu", "Iperó", "Ipeúna", "Ipiguá", "Iporanga", "Ipuã", "Iracemápolis", "Irapuru", "Itaberá", "Itaí", "Itajobi", "Itaju", "Itajupe", "Itanhaém", "Itaoca", "Itapetininga", "Itapeva", "Itapevi", "Itapira", "Itapirapuã Paulista", "Itápolis", "Itaporanga", "Itapuí", "Itapura", "Itararé", "Itariri", "Itatiba", "Itatinga", "Itirapina", "Itirapuã", "Itobi", "Itu", "Itupeva", "Ituverava", "Jaborandi", "Jaboticabal", "Jacareí", "Jaci", "Jacupiranga", "Jaguariúna", "Jales", "Jambeiro", "Jandira", "Jardinópolis", "Jarinu", "Jarinu", "Jaú", "Jeriquara", "Joanópolis", "João Ramalho", "Joaquim Egydio", "Jordânia", "José Bonifácio", "Júlio Mesquita", "Jumirim", "Jundiaí", "Junqueirópolis", "Juquiá", "Juquitiba", "Laranjal Paulista", "Lavínias", "Lavrinhas", "Leme", "Lençóis Paulista", "Lindóia", "Lins", "Lorena", "Lourdes", "Louveira", "Lucélia", "Lucianópolis", "Luiz Antônio", "Lupércio", "Lutécia", "Macaubal", "Macatuba", "Macedônia", "Magda", "Mairinque", "Mairiporã", "Manduri", "Marabá Paulista", "Maracaí", "Marapoama", "Mariápolis", "Marília", "Marinópolis", "Martinópolis", "Matão", "Mauá", "Mendonça", "Meridiano", "Mesópolis", "Miguelópolis", "Mineiros do Tietê", "Miracatu", "Mirandópolis", "Mirante do Paranapanema", "Mirassol", "Mirassolândia", "Mococa", "Mongaguá", "Monte Alegre do Sul", "Monte Alto", "Monte Aprazível", "Monte Azul Paulista", "Monte Castelo", "Monte Guimarães", "Monte Mor", "Monteiro Lobato", "Morro Agudo", "Morungaba", "Mossoró", "Mota", "Murutinga do Sul", "Nantes", "Narandiba", "Natividade da Serra", "Nazaré Paulista", "Neves Paulista", "Nhandeara", "Nipoã", "Nova Aliança", "Nova Campina", "Nova Canaã Paulista", "Nova Castilho", "Nova Europa", "Nova Granada", "Nova Guataporanga", "Nova Independência", "Nova Luzitânia", "Nova Odessa", "Novais", "Novo Horizonte", "Nuporanga", "Ocauçu", "Óleo", "Olímpia", "Ouro Verde", "Ouroeste", "Ourinhos", "Pacaembu", "Palestina", "Palmares Paulista", "Palmeira d'Oeste", "Palmital", "Panorama", "Paraguaçu Paulista", "Paraibuna", "Paranapanema", "Paranapuã", "Parapuã", "Pardinho", "Pariquera-Açu", "Parisi", "Patrocínio Paulista", "Pauliceia", "Paulínia", "Paulistânia", "Pavão", "Pederneiras", "Pedra Bela", "Pedranópolis", "Pedregulho", "Pedrinhas Paulista", "Pedro de Toledo", "Penápolis", "Pereira Barreto", "Pereiras", "Piedade", "Pindorama", "Pindamonhangaba", "Pinhalzinho", "Piquerobi", "Piquete", "Piracaia", "Piracicaba", "Pirajú", "Pirangi", "Pirapora do Bom Jesus", "Pirapozinho", "Pirassununga", "Piratininga", "Pitangueiras", "Planalto", "Platina", "Poá", "Poloni", "Pompéia", "Pongaí", "Pontes Gestal", "Populina", "Porangaba", "Porto Feliz", "Porto Ferreira", "Potim", "Potirendaba", "Pratânia", "Presidente Alves", "Presidente Bernardes", "Presidente Epitácio", "Presidente Prudente", "Presidente Venceslau", "Promissão", "Quadra", "Quatá", "Queiroz", "Queluz", "Quintana", "Rafard", "Rancharia", "Redenção da Serra", "Regente Feijó", "Reginópolis", "Registro", "Restinga", "Ribeira", "Ribeirão Bonito", "Ribeirão Branco", "Ribeirão Corrente", "Ribeirão do Sul", "Ribeirão Pires", "Ribeirão Preto", "Rifaina", "Rincão", "Rinópolis", "Rio Claro", "Rio das Pedras", "Rio Grande da Serra", "Riolândia", "Riversul", "Rosana", "Roseira", "Rubim", "Rubinéia", "Sabino", "Sagres", "Sales", "Sales de Oliveira", "Salesópolis", "Salmourão", "Saltinho", "Salto", "Salto de Pirapora", "Salto Grande", "Sandovalina", "Santana da Ponte Pensa", "Santana de Parnaíba", "Santo André", "Santo Antônio da Alegria", "Santo Antônio de Posse", "Santo Antônio do Jardim", "Santo Antônio do Pinhal", "Santo Expedito", "Santópolis do Aguapeí", "Santos", "São Bento do Sapucaí", "São Bernardo do Campo", "São Caetano do Sul", "São Carlos", "São Francisco", "São João da Boa Vista", "São João das Duas Pontes", "São João de Iracema", "São João do Pau d'Alho", "São Joaquim da Barra", "São José do Barreiro", "São José do Rio Pardo", "São José do Rio Preto", "São José dos Campos", "São Lourenço da Serra", "São Luís do Paraitinga", "São Manuel", "São Miguel Arcanjo", "São Paulo", "São Pedro", "São Pedro do Turvo", "São Roque", "São Sebastião", "São Sebastião da Grama", "São Simão", "São Vicente", "Sarapuí", "Sarutaiá", "Sebastiânia", "Serra Azul", "Serrana", "Sertãozinho", "Sete Barras", "Severínia", "Silveiras", "Socorro", "Sorocaba", "Sud Mennucci", "Sumaré", "Suzano", "Suzanópolis", "Tabapuã", "Tabatinga", "Taboão da Serra", "Taciba", "Taguaí", "Taiaçu", "Taiaçupeba", "Taimbé", "Tajiti", "Tambaú", "Tanabi", "Tapiraí", "Tapiratiba", "Taquaral", "Taquaritinga", "Taquarituba", "Taquarivaí", "Tarabai", "Tarumã", "Tatuí", "Taubaté", "Tejupá", "Teodoro Sampaio", "Terra Roxa", "Tietê", "Timburi", "Torre de Pedra", "Torrinha", "Trabiju", "Treviso", "Tremembé", "Três Fronteiras", "Tuiuti", "Tupã", "Tupi Paulista", "Turiúba", "Turmalina", "Ubarana", "Ubatuba", "Ubirajara", "Uchoa", "União Paulista", "Urânia", "Uru", "Urupês", "Valentim Gentil", "Valinhos", "Valparaíso", "Vargem", "Vargem Grande do Sul", "Vargem Grande Paulista", "Várzea Paulista", "Vera Cruz", "Vincedo", "Viradouro", "Vitorino Brasil", "Votorantim", "Votuporanga", "Zacarias"
];

// Pricing data (CSV format: City,Type,Time,Price)
const pricingData = [
"São Paulo,PB,2,2200.00",
"São Paulo,PB,3,2500.00",
"São Paulo,PB,4,2800.00",
"São Paulo,PB,5,3100.00",
"São Paulo,PB,6,3400.00",
"São Paulo,PB,7,3800.00",
"São Paulo,PB,8,4100.00",
"São Paulo,Colorido,2,2500.00",
"São Paulo,Colorido,3,2800.00",
"São Paulo,Colorido,4,3100.00",
"São Paulo,Colorido,5,3400.00",
"São Paulo,Colorido,6,3800.00",
"São Paulo,Colorido,7,4100.00",
"São Paulo,Colorido,8,4500.00",

"Santo André,PB,2,2200.00",
"Santo André,PB,3,2500.00",
"Santo André,PB,4,2800.00",
"Santo André,PB,5,3100.00",
"Santo André,PB,6,3400.00",
"Santo André,PB,7,3800.00",
"Santo André,PB,8,4100.00",
"Santo André,Colorido,2,2500.00",
"Santo André,Colorido,3,2800.00",
"Santo André,Colorido,4,3100.00",
"Santo André,Colorido,5,3400.00",
"Santo André,Colorido,6,3800.00",
"Santo André,Colorido,7,4100.00",
"Santo André,Colorido,8,4500.00",

"São Bernardo do Campo,PB,2,2200.00",
"São Bernardo do Campo,PB,3,2500.00",
"São Bernardo do Campo,PB,4,2800.00",
"São Bernardo do Campo,PB,5,3100.00",
"São Bernardo do Campo,PB,6,3400.00",
"São Bernardo do Campo,PB,7,3800.00",
"São Bernardo do Campo,PB,8,4100.00",
"São Bernardo do Campo,Colorido,2,2500.00",
"São Bernardo do Campo,Colorido,3,2800.00",
"São Bernardo do Campo,Colorido,4,3100.00",
"São Bernardo do Campo,Colorido,5,3400.00",
"São Bernardo do Campo,Colorido,6,3800.00",
"São Bernardo do Campo,Colorido,7,4100.00",
"São Bernardo do Campo,Colorido,8,4500.00",

"São Caetano do Sul,PB,2,2200.00",
"São Caetano do Sul,PB,3,2500.00",
"São Caetano do Sul,PB,4,2800.00",
"São Caetano do Sul,PB,5,3100.00",
"São Caetano do Sul,PB,6,3400.00",
"São Caetano do Sul,PB,7,3800.00",
"São Caetano do Sul,PB,8,4100.00",
"São Caetano do Sul,Colorido,2,2500.00",
"São Caetano do Sul,Colorido,3,2800.00",
"São Caetano do Sul,Colorido,4,3100.00",
"São Caetano do Sul,Colorido,5,3400.00",
"São Caetano do Sul,Colorido,6,3800.00",
"São Caetano do Sul,Colorido,7,4100.00",
"São Caetano do Sul,Colorido,8,4500.00",

"Santos,PB,2,2000.00",
"Santos,PB,3,2300.00",
"Santos,PB,4,2600.00",
"Santos,PB,5,2900.00",
"Santos,PB,6,3100.00",
"Santos,PB,7,3400.00",
"Santos,PB,8,3700.00",
"Santos,Colorido,2,2300.00",
"Santos,Colorido,3,2600.00",
"Santos,Colorido,4,2900.00",
"Santos,Colorido,5,3100.00",
"Santos,Colorido,6,3400.00",
"Santos,Colorido,7,3700.00",
"Santos,Colorido,8,4000.00",

"São Vicente,PB,2,2000.00",
"São Vicente,PB,3,2300.00",
"São Vicente,PB,4,2600.00",
"São Vicente,PB,5,2900.00",
"São Vicente,PB,6,3100.00",
"São Vicente,PB,7,3400.00",
"São Vicente,PB,8,3700.00",
"São Vicente,Colorido,2,2300.00",
"São Vicente,Colorido,3,2600.00",
"São Vicente,Colorido,4,2900.00",
"São Vicente,Colorido,5,3100.00",
"São Vicente,Colorido,6,3400.00",
"São Vicente,Colorido,7,3700.00",
"São Vicente,Colorido,8,4000.00"
];
];

// Populate city select
function populateCities() {
    const citySelect = document.getElementById('city-select');
    saoPauloCities.sort().forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Parse pricing data
function parsePricingData() {
    return pricingData.map(line => {
        const parts = line.split(',');
        return {
            city: parts[0],
            type: parts[1], // PB or Colorido
            time: parseInt(parts[2]),
            price: parseFloat(parts[3])
        };
    });
}

// Get price for city, type, and time
function getPrice(city, type, time) {
    const data = parsePricingData();
    const priceEntry = data.find(item =>
        item.city === city &&
        item.type === type &&
        item.time === time
    );
    return priceEntry ? priceEntry.price : null;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', populateCities);