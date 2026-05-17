// Supabase Configuration
const SUPABASE_URL = 'https://spunhqjwlooktyvrleef.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdW5ocWp3bG9va3R5dnJsZWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjM3MzEsImV4cCI6MjA5MzM5OTczMX0.Df5dFmacPRfJxdQUtP5y0hnnmufZoNbzkp3N1gAhoPI';

// Resend Configuration (substitua pela sua API Key do Resend)
const RESEND_API_KEY = 're_LTZKWLjM_CfWMbmfHBc756wYFzmexV2ct'; // Obtenha em https://resend.com/api-keys
const RESEND_FROM_EMAIL = 'cotacoes@tatua.com.br'; // Domínio verificado no Resend
const REMINDER_EMAIL = 'tattootatua@gmail.com';

// Variável global para armazenar dados da cotação atual (para uso na mensagem de rejeição)
window.quoteData = {
    city: '',
    eventDate: '',
    actionTime: ''
};

// =====================================================
// FUNÇÕES DE LEMBRETE DE COTAÇÕES
// =====================================================

// Função para buscar cotações com 60 dias para o evento
async function buscarCotacoes60Dias() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/buscar_cotacoes_60_dias`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Erro ao buscar cotações: ${errorData.message || response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar cotações de 60 dias:', error);
        throw error;
    }
}

// Função para formatar o email HTML
function formatarEmailLembrete(cotacoes) {
    if (cotacoes.length === 0) {
        return null; // Sem cotações para enviar
    }

    const dataHoje = new Date().toLocaleDateString('pt-BR');

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .cotacao-item { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .cotacao-item h3 { margin: 0 0 10px 0; color: #667eea; }
                .info-row { display: flex; margin-bottom: 8px; }
                .info-label { font-weight: bold; width: 120px; color: #555; }
                .info-value { flex: 1; }
                .whatsapp-btn { display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 25px; margin-top: 15px; font-weight: bold; }
                .whatsapp-btn:hover { background: #128C7E; }
                .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
                .preco { color: #28a745; font-weight: bold; font-size: 18px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📅 Lembretes de Cotações</h1>
                    <p>Eventos com 60 dias para acontecer</p>
                </div>
                <div class="content">
                    <p>Olá! Encontramos <strong>${cotacoes.length} cotação(ões)</strong> com 60 dias para o evento:</p>
    `;

    cotacoes.forEach((c, index) => {
        const dataFormatada = new Date(c.data_evento).toLocaleDateString('pt-BR');
        const pricePB = c.price_pb ? c.price_pb.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A';
        const priceColorido = c.price_colorido ? c.price_colorido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A';

        html += `
            <div class="cotacao-item">
                <h3>📋 ${c.codigo_cotacao}</h3>
                <div class="info-row">
                    <span class="info-label">Cliente:</span>
                    <span class="info-value">${c.nome || 'Não informado'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Telefone:</span>
                    <span class="info-value">${c.telefone || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Cidade:</span>
                    <span class="info-value">${c.cidade}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Data Evento:</span>
                    <span class="info-value">${dataFormatada}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tempo Ação:</span>
                    <span class="info-value">${c.action_time} horas</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Preços:</span>
                    <span class="info-value">
                        PB: <span class="preco">${pricePB}</span> |
                        Colorido: <span class="preco">${priceColorido}</span>
                    </span>
                </div>
                <a href="${c.whatsapp_link}" class="whatsapp-btn" target="_blank">
                    💬 Contatar no WhatsApp
                </a>
            </div>
        `;
    });

    html += `
                    <div class="footer">
                        <p>Enviado automaticamente pelo Sistema de Cotação Tatuá</p>
                        <p>Data: ${dataHoje}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    return html;
}

// Função para enviar email via Edge Function do Supabase (evita CORS)
async function enviarEmailLembrete(html) {
    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-reminder-frontend`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                html: html,
                subject: `📅 Lembretes de Cotações - ${new Date().toLocaleDateString('pt-BR')}`
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Erro ao enviar email: ${errorData.message || response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
}

// Função principal: Buscar cotações e enviar email
async function executarLembreteCotacoes() {
    try {
        console.log('Buscando cotações com 60 dias para o evento...');

        const cotacoes = await buscarCotacoes60Dias();

        if (cotacoes.length === 0) {
            alert('✅ Não há cotações com 60 dias para o evento.');
            console.log('Nenhuma cotação encontrada para o dia de hoje.');
            return { success: true, message: 'Nenhuma cotação encontrada', cotacoes: [] };
        }

        console.log(`Encontradas ${cotacoes.length} cotação(ões):`, cotacoes);

        const html = formatarEmailLembrete(cotacoes);

        if (!html) {
            alert('Erro ao formatar o email.');
            return { success: false, message: 'Erro ao formatar email' };
        }

        console.log('Enviando email...');

        const emailResult = await enviarEmailLembrete(html);

        console.log('Email enviado com sucesso:', emailResult);

        alert(`✅ Email enviado com sucesso!\n\n${cotacoes.length} cotação(ões) processada(s).`);

        return { success: true, message: 'Email enviado', cotacoes: cotacoes };

    } catch (error) {
        console.error('Erro ao executar lembrete:', error);
        alert(`❌ Erro ao executar lembrete: ${error.message}`);
        return { success: false, message: error.message };
    }
}

// Main application logic

// Coordinates for distance calculation
const saoPauloZoneSul = {
    lat: -23.6126,
    lon: -46.6952
};

// Road distance calculation factor (approximately 1.3x straight line distance)
const ROAD_DISTANCE_FACTOR = 1.3;

// Date calculation constants
const ONE_YEAR_DAYS = 365;
const TWO_YEARS_DAYS = 730;

// São Paulo city coordinates for fallback pricing
const saoPauloCoords = {
    lat: -23.5505,
    lon: -46.6333
};

// City coordinates (sample - would need full dataset for production)
const cityCoordinates = {
    "São Paulo": { lat: -23.5505, lon: -46.6333 },
    "Santos": { lat: -23.9527, lon: -46.3331 },
    "Campinas": { lat: -22.9064, lon: -47.0616 },
    "São Bernardo do Campo": { lat: -23.6944, lon: -46.5653 },
    "Santo André": { lat: -23.6632, lon: -46.5384 },
    "São José dos Campos": { lat: -23.2237, lon: -45.9009 },
    "Ribeirão Preto": { lat: -21.1767, lon: -47.8103 },
    "Sorocaba": { lat: -23.5016, lon: -47.4525 },
    "São José do Rio Preto": { lat: -20.8197, lon: -49.3796 },
    "Bauru": { lat: -22.3152, lon: -49.0609 },
    "Taubaté": { lat: -23.0264, lon: -45.5556 },
    "Piracicaba": { lat: -22.7253, lon: -47.6492 },
    "Limeira": { lat: -22.5651, lon: -47.4017 },
    "Guarulhos": { lat: -23.4543, lon: -46.5337 },
    "São Vicente": { lat: -23.9633, lon: -46.3918 },
    "Praia Grande": { lat: -24.0099, lon: -46.4033 },
    "Diadema": { lat: -23.6861, lon: -46.6153 },
    "Carapicuíba": { lat: -23.5225, lon: -46.8369 },
    "Mauá": { lat: -23.6678, lon: -46.4606 },
    "Itaquaquecetuba": { lat: -23.4875, lon: -46.3492 },
    "Mogi das Cruzes": { lat: -23.5208, lon: -46.1875 },
    "Suzano": { lat: -23.5428, lon: -46.3114 },
    "Taboão da Serra": { lat: -23.6261, lon: -46.7917 },
    "Embu das Artes": { lat: -23.6497, lon: -46.8517 },
    "Cotia": { lat: -23.6039, lon: -46.9189 },
    "Barueri": { lat: -23.5111, lon: -46.8811 },
    "Jandira": { lat: -23.5256, lon: -46.9011 },
    "Osasco": { lat: -23.5329, lon: -46.7917 },
    "São Caetano do Sul": { lat: -23.6236, lon: -46.5489 },
    "Mogi Guaçu": { lat: -22.3689, lon: -46.9417 },
    "São Carlos": { lat: -22.0053, lon: -47.8892 },
    "Araraquara": { lat: -21.7947, lon: -48.1753 },
    "Botucatu": { lat: -22.8853, lon: -48.4453 },
    "Pindamonhangaba": { lat: -22.9278, lon: -45.2647 },
    "Bragança Paulista": { lat: -22.9508, lon: -46.5408 },
    "Jundiaí": { lat: -23.1905, lon: -46.8875 },
    "Francisco Morato": { lat: -23.2856, lon: -46.7469 },
    "Itu": { lat: -23.2636, lon: -47.2986 },
    "São Roque": { lat: -23.5244, lon: -47.1344 },
    "Valinhos": { lat: -22.9681, lon: -46.9986 },
    "Vinhedo": { lat: -22.9686, lon: -46.8742 },
    "Americana": { lat: -22.7386, lon: -47.3314 },
    "Atibaia": { lat: -23.1161, lon: -46.5506 },
    "Jacareí": { lat: -23.3075, lon: -45.9611 },
    "Rio Claro": { lat: -22.4081, lon: -47.5631 },
    "Limeira": { lat: -22.5651, lon: -47.4017 },
    "Marília": { lat: -22.2144, lon: -49.9456 },
    "Presidente Prudente": { lat: -22.1275, lon: -51.3928 },
    "Araçatuba": { lat: -21.2089, lon: -50.4328 },
    "São José do Rio Pardo": { lat: -21.5975, lon: -46.8875 },
    "Pirassununga": { lat: -21.9856, lon: -47.4256 }
};

// Calculate road distance between two points (in km)
// Uses straight-line distance multiplied by road factor
function calculateRoadDistance(lat1, lon1, lat2, lon2) {
    const straightLineDistance = calculateStraightLineDistance(lat1, lon1, lat2, lon2);
    const roadDistance = straightLineDistance * ROAD_DISTANCE_FACTOR;
    return roadDistance;
}

// Calculate straight-line distance between two points using Haversine formula (in km)
function calculateStraightLineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Calculate difference in days between two dates
function diffDaysBetweenDates(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.abs(date1 - date2) / oneDay;
    return diffDays;
}

// Calculate price adjustment based on event date
function calculateDateAdjustment(eventDateStr) {
    const eventDate = new Date(eventDateStr);
    const currentDate = new Date();

    // Calculate difference in days
    const diffTime = Math.abs(eventDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Check if date is in the past
    if (eventDate < currentDate) {
        return {
            adjustmentFactor: 0,
            adjustmentPercentage: 0,
            shouldReject: true,
            rejectReason: 'A data do evento não pode ser anterior à data atual.'
        };
    }

    // Rule 1: Between now and 365 days (1 year) - maintain calculated value
    if (diffDays <= ONE_YEAR_DAYS) {
        return {
            adjustmentFactor: 1.0,
            adjustmentPercentage: 0,
            shouldReject: false,
            rejectReason: null
        };
    }

    // Rule 2: Between 1 and 2 years - add 5%
    if (diffDays > ONE_YEAR_DAYS && diffDays <= TWO_YEARS_DAYS) {
        return {
            adjustmentFactor: 1.05,
            adjustmentPercentage: 5,
            shouldReject: false,
            rejectReason: null
        };
    }

    // Rule 3: Above 2 years - reject quote
    if (diffDays > TWO_YEARS_DAYS) {
        return {
            adjustmentFactor: 0,
            adjustmentPercentage: 0,
            shouldReject: true,
            rejectReason: `A data do evento está muito distante (${diffDays} dias). Aceitamos cotações para eventos até 2 anos à frente.`
        };
    }

    return {
        adjustmentFactor: 1.0,
        adjustmentPercentage: 0,
        shouldReject: false,
        rejectReason: null
    };
}

// Generate unique hash for quote
function generateQuoteHash() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `TAT-${timestamp}-${random}`.toUpperCase();
}

// Number to words in Portuguese
function numberToWords(num) {
    if (num === 0) return "zero";

    const ones = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
        return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' e ' + ones[num % 10] : '');
    }
    if (num < 1000) {
        return hundreds[Math.floor(num / 100)] + (num % 100 !== 0 ? ' e ' + numberToWords(num % 100) : '');
    }
    if (num < 1000000) {
        const thousands = Math.floor(num / 1000);
        const remainder = num % 1000;
        let result = '';
        if (thousands === 1) {
            result = 'mil';
        } else {
            result = numberToWords(thousands) + ' mil';
        }
        return result + (remainder !== 0 ? ' e ' + numberToWords(remainder) : '');
    }
    return num.toString();
}

// Currency to words in Portuguese with cents
function currencyToWords(value) {
    const reais = Math.floor(value);
    const centavos = Math.round((value - reais) * 100);

    let result = numberToWords(reais) + ' reais';

    if (centavos > 0) {
        result += ' e ' + numberToWords(centavos) + ' centavos';
    }

    return result;
}

// Format currency to Portuguese
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Calculate action time based on number of guests
function calculateActionTime(guests) {
    if (guests < 150) {
        return 2;
    } else {
        const result = Math.ceil((guests - 150) / 60) + 2;
        return result;
    }
}

// Get or estimate city coordinates
function getCityCoordinates(city) {
    if (cityCoordinates[city]) {
        return cityCoordinates[city];
    }

    // If city not in database, estimate based on name (simplified)
    // In production, this would use a proper geocoding API
    const saoPauloCoords = {
        lat: -23.5505,
        lon: -46.6333
    };

    // Add some random variation to simulate different cities
    const variation = Math.random() * 2 - 1;
    return {
        lat: saoPauloCoords.lat + variation,
        lon: saoPauloCoords.lon + variation
    };
}

// Call criar_cotacao function from database (handles all calculations)
async function callCriarCotacao(eventDate, city, timeOption, numberInput, clientName, clientPhone) {
    try {
        const hash = generateQuoteHash();

        // Determine action time
        let actionTime;
        let guests = null;

        if (timeOption === 'time') {
            actionTime = parseInt(numberInput);
        } else {
            guests = parseInt(numberInput);
            actionTime = calculateActionTime(guests);
        }

        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/criar_cotacao`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                p_codigo_cotacao: hash,
                p_data_evento: eventDate,
                p_cidade: city,
                p_time_option: timeOption,
                p_action_time: actionTime,
                p_nome: clientName || '',
                p_telefone: clientPhone || '',
                p_quantidade_convidados: guests
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erro na função criar_cotacao:', errorData);
            return { success: false, message: errorData.message || 'Erro ao processar cotação.' };
        }

        const result = await response.json();

        if (result[0] && !result[0].success) {
            // Database rejected the quote (distance > 130 or other validation)
            return { success: false, message: result[0].message };
        }

        // Success - build quote data object
        return {
            success: true,
            hash: hash,
            eventDate: eventDate,
            city: city,
            timeOption: timeOption,
            actionTime: actionTime,
            guests: guests,
            clientName: clientName,
            clientPhone: clientPhone,
            pricePB: result[0].price_pb,
            priceColorido: result[0].price_colorido,
            guestDetails: result[0].guest_details,
            routeDetails: result[0].route_details,
            dateAdjustmentDetails: result[0].date_adjustment_details
        };

    } catch (error) {
        console.error('Erro ao chamar criar_cotacao:', error);
        return { success: false, message: 'Erro ao processar cotação.' };
    }
}

// Save quote to Supabase database (no longer needed, kept for compatibility)
async function saveQuoteHistory(currentQuoteData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/criar_cotacao`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                p_codigo_cotacao: currentQuoteData.hash,
                p_data_evento: currentQuoteData.eventDate,
                p_cidade: currentQuoteData.city,
                p_time_option: currentQuoteData.timeOption,
                p_action_time: currentQuoteData.actionTime,
                p_nome: currentQuoteData.clientName || '',
                p_telefone: currentQuoteData.clientPhone || '',
                p_quantidade_convidados: currentQuoteData.timeOption === 'guests' ? currentQuoteData.guests : null
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }

        const result = await response.json();
        console.log('Cotação salva com sucesso no Supabase:', result);

        // Atualizar os preços com os valores retornados diretamente da função
        if (result[0] && result[0].success) {
            currentQuoteData.pricePB = result[0].price_pb;
            currentQuoteData.priceColorido = result[0].price_colorido;
            currentQuoteData.guestDetails = result[0].guest_details;
            currentQuoteData.routeDetails = result[0].route_details;
            currentQuoteData.dateAdjustmentDetails = result[0].date_adjustment_details;
            console.log('Preços atualizados com valores do banco de dados:', {
                pricePB: currentQuoteData.pricePB,
                priceColorido: currentQuoteData.priceColorido
            });
        }

    } catch (error) {
        console.error('Erro ao salvar no Supabase:', error);
        throw error;
    }
}

// Generate and download document using Word template
function generatePDF(currentQuoteData) {
    // Show loading state
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Gerando documento...';
    }

    // Wait for required libraries to be available
    if (typeof window.PizZip === 'undefined' || typeof window.docxtemplater === 'undefined') {
        // Fallback to simple PDF generation if libraries aren't available
        generateSimplePDF(currentQuoteData, downloadBtn);
        return;
    }

    // Load the Word template
    fetch('Form_Proposta.docx', { mode: 'cors' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o template de proposta');
            }
            return response.arrayBuffer();
        })
        .catch(error => {
            // If fetch fails due to CORS or file protocol, use fallback
            console.warn('Fetch falhou, usando método alternativo:', error);
            generateSimplePDF(currentQuoteData, downloadBtn);
            throw error; // Re-throw to stop the promise chain
        })
        .then(content => {
            // Unzip the content
            const zip = new PizZip(content);

            // Prepare data for template
            const date = new Date();
            const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            const currentDate = `${String(date.getDate()).padStart(2, '0')} de ${months[date.getMonth()]} de ${date.getFullYear()}`;

            const templateData = {
                'data atual': currentDate,
                'DATA ATUAL': currentDate,
                'cidade escolhida': currentQuoteData.city,
                'CIDADE ESCOLHIDA': currentQuoteData.city,
                'tempo de ação': currentQuoteData.actionTime + ' horas',
                'TEMPO DE AÇÃO': currentQuoteData.actionTime + ' horas',
                'valor pb': formatCurrency(currentQuoteData.pricePB),
                'VALOR PB': formatCurrency(currentQuoteData.pricePB),
                'valor pb extenso': currencyToWords(currentQuoteData.pricePB),
                'VALOR PB EXTENSO': currencyToWords(currentQuoteData.pricePB),
                'valor colorido': formatCurrency(currentQuoteData.priceColorido),
                'VALOR COLORIDO': formatCurrency(currentQuoteData.priceColorido),
                'valor colorido extenso': currencyToWords(currentQuoteData.priceColorido),
                'VALOR COLORIDO EXTENSO': currencyToWords(currentQuoteData.priceColorido),
                'hash proposta': currentQuoteData.hash,
                'HASH PROPOSTA': currentQuoteData.hash,
                'nome': currentQuoteData.clientName,
                'NOME': currentQuoteData.clientName,
                'telefone': currentQuoteData.clientPhone,
                'TELEFONE': currentQuoteData.clientPhone
            };

            // Load and compile template
            const doc = new window.docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                delimiters: {
                    start: '[',
                    end: ']'
                }
            });

            // Set the template variables
            doc.setData(templateData);

            // Render the document
            doc.render();

            // Generate the output document as Blob
            const out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            // Download the Word document
            saveAs(out, `proposta_${currentQuoteData.hash}.docx`);

            // Show success message with instructions for PDF conversion
            alert('Documento Word gerado com sucesso!\n\nPara converter para PDF:\n1. Abra o documento Word\n2. Vá em "Salvar como" ou "Exportar"\n3. Escolha "PDF" como formato\n4. Salve o arquivo');

            // Reset button state
            if (downloadBtn) {
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Download Word';
            }
        })
        .catch(error => {
            console.error('Erro ao gerar documento:', error);
            // Don't show alert if we already used fallback
            if (downloadBtn && downloadBtn.disabled) {
                alert('Erro ao gerar o documento: ' + error.message + '. Usando método alternativo.');
                generateSimplePDF(currentQuoteData, downloadBtn);
            }
        });
}

// Fallback function to generate simple PDF using jsPDF directly
function generateSimplePDF(currentQuoteData, downloadBtn) {
    if (typeof window.jspdf === 'undefined') {
        alert('A biblioteca PDF está carregando. Tente novamente em alguns segundos.');
        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'Download PDF';
        }
        return;
    }

    const { jsPDF } = window.jspdf;

    // Create PDF document
    const doc = new jsPDF();

    // Set font and add title
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(102, 102, 102);
    doc.text('PROPOSTA DE SERVIÇO', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Tatuagens Temporárias', 105, 30, { align: 'center' });

    // Add line separator
    doc.setDrawColor(102, 102, 102);
    doc.line(20, 35, 190, 35);

    // Add quote details
    let yPos = 45;
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);

    // Function to add text with labels
    function addDetail(label, value) {
        doc.setTextColor(102, 102, 102);
        doc.setFont('helvetica', 'bold');
        doc.text(label, 25, yPos);
        doc.setTextColor(153, 153, 153);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 25, yPos + 5);
        yPos += 15;
    }

    addDetail('Data da Proposta:', new Date().toLocaleDateString('pt-BR'));
    addDetail('Código da Proposta:', currentQuoteData.hash);
    addDetail('Cidade:', currentQuoteData.city);
    addDetail('Tempo de Ação:', currentQuoteData.actionTime + ' horas');

    // Add guest details if present
    if (currentQuoteData.timeOption === 'guests' && currentQuoteData.guestDetails) {
        const guestDetails = currentQuoteData.guestDetails.replace(/<[^>]*>/g, '').trim();
        const lines = guestDetails.split('\n').filter(line => line.trim() !== '');

        if (lines.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text('Detalhes dos Convidados:', 25, yPos);
            yPos += 5;

            doc.setFont('helvetica', 'normal');
            lines.forEach(line => {
                doc.text('• ' + line.trim(), 30, yPos);
                yPos += 5;
            });
            yPos += 5;
        }
    }

    // Add service description
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(20, yPos, 170, 50, 3, 3, 'F');

    doc.setTextColor(102, 102, 102);
    doc.setFont('helvetica', 'bold');
    doc.text('O SERVIÇO CONTEMPLA:', 25, yPos + 10);

    const serviceText = 'Todos os equipamentos necessários para aplicação das tatuagens temporárias, como: criação das artes, equipamentos de impressão, tinta, tablet para mostrar os desenhos que podem ser tatuados, 2 funcionários para aplicação das tatuagens nos convidados do evento durante o tempo pré-definido de ' + currentQuoteData.actionTime + ' horas.';

    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(serviceText, 160);
    splitText.forEach((line, i) => {
        doc.text('• ' + line, 30, yPos + 10 + (i * 5));
    });

    yPos += 35;

    // Add prices section
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(20, yPos, 170, 60, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 102, 102);
    doc.text('OPÇÕES DE PREÇO', 105, yPos + 10, { align: 'center' });

    yPos += 20;

    // Preto e Branco
    const pricePB = formatCurrency(currentQuoteData.pricePB);
    const pricePBWords = currencyToWords(currentQuoteData.pricePB) + ' reais';

    doc.text('PRETO E BRANCO', 105, yPos, { align: 'center' });
    yPos += 10;
    doc.setFontSize(16);
    doc.text(pricePB, 105, yPos, { align: 'center' });
    yPos += 15;
    doc.setFontSize(10);
    doc.text(pricePBWords, 105, yPos, { align: 'center' });

    yPos += 25;

    // Colorido
    const priceColorido = formatCurrency(currentQuoteData.priceColorido);
    const priceColoridoWords = currencyToWords(currentQuoteData.priceColorido) + ' reais';

    doc.setFontSize(12);
    doc.text('COLORIDO', 105, yPos, { align: 'center' });
    yPos += 10;
    doc.setFontSize(16);
    doc.text(priceColorido, 105, yPos, { align: 'center' });
    yPos += 15;
    doc.setFontSize(10);
    doc.text(priceColoridoWords, 105, yPos, { align: 'center' });

    yPos += 30;

    // Add hash code
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(50, yPos, 110, 20, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text('CÓDIGO: ' + currentQuoteData.hash, 105, yPos + 8, { align: 'center' });

    yPos += 35;

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(153, 153, 153);
    doc.text('Proposta válida por 30 dias', 105, yPos, { align: 'center' });
    doc.text('Contato: (13) 99784-8897', 105, yPos + 8, { align: 'center' });

    // Save PDF
    doc.save(`cotacao_${currentQuoteData.hash}.pdf`);

    // Reset button state
    if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download PDF';
    }
}
// Generate WhatsApp message
function generateWhatsAppMessage(currentQuoteData) {
    let message = `Olá! Gostaria de contratar o serviço de tatuagens temporárias.

*Dados da Cotação:*
📋 Código: ${currentQuoteData.hash}
📅 Data do Evento: ${currentQuoteData.eventDate}
📍 Cidade: ${currentQuoteData.city}
⏰ Tempo de Ação: ${currentQuoteData.actionTime} horas`;

    // Add guest details if present
    if (currentQuoteData.guestDetails) {
        message += `
${currentQuoteData.guestDetails.replace(/<[^>]*>/g, '').replace(/<[^>]*>/g, '')}`;
    }

    // Add route details if present
    if (currentQuoteData.routeDetails) {
        message += `
${currentQuoteData.routeDetails.replace(/<[^>]*>/g, '').replace(/<[^>]*>/g, '')}`;
    }

    message += `
*Opções de Preço:*
🎨 Preto e Branco: ${formatCurrency(currentQuoteData.pricePB)}
🌈 Colorido: ${formatCurrency(currentQuoteData.priceColorido)}

Aguardo contato para prosseguirmos!`;

    return encodeURIComponent(message);
}

// Validar telefone
function validarTelefone(telefone) {
    // Remover caracteres não numéricos
    const numeros = telefone.replace(/\D/g, '');

    // Verificar quantidade de dígitos (10 ou 11)
    if (numeros.length < 10 || numeros.length > 11) {
        return { valido: false };
    }

    // Verificar se todos os números são iguais (ex: 11111111111)
    const todosIguais = numeros.split('').every(digito => digito === numeros[0]);
    if (todosIguais) {
        return { valido: false };
    }

    // Verificar se os últimos 8 números são iguais
    const ultimos8 = numeros.slice(-8);
    const ultimos8Iguais = ultimos8.split('').every(digito => digito === ultimos8[0]);
    if (ultimos8Iguais) {
        return { valido: false };
    }

    return { valido: true };
}

// Handle form submission
async function handleQuoteForm(event) {
    event.preventDefault();

    console.log('Form submitted successfully'); // Debug

    // Check if we have confirmed time data
    if (window.confirmedTimeData) {
        const confirmedData = window.confirmedTimeData;
        window.confirmedTimeData = null;

        // Use confirmed data
        processQuoteWithTimeData(confirmedData);
        return;
    }

    // Get form data
    const formData = new FormData(event.target);
    const eventDate = formData.get('event-date');
    const city = formData.get('city');
    const timeOption = formData.get('time-option');
    const numberInput = formData.get('number-input');
    const clientName = formData.get('client-name');
    const clientPhone = formData.get('client-phone');

    // Armazenar dados da cotação na variável global (para uso na mensagem de rejeição)
    window.quoteData = {
        city: city,
        eventDate: eventDate,
        actionTime: '' // Será preenchido após calculo
    };

    console.log('Form data:', { eventDate, city, timeOption, numberInput, clientName, clientPhone }); // Debug

    // Validar telefone
    const validacaoTelefone = validarTelefone(clientPhone);
    if (!validacaoTelefone.valido) {
        alert('Numero de telefone invalido');
        return;
    }

    // Show loading
    document.getElementById('quote-request').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    // Call database function to calculate everything (prices, distance, validations)
    setTimeout(async function() {
        try {
            const result = await callCriarCotacao(eventDate, city, timeOption, numberInput, clientName, clientPhone);

            if (!result.success) {
                // Show rejection message
                document.getElementById('loading').style.display = 'none';
                const rejectionElement = document.getElementById('quote-rejected');
                const rejectionMessage = rejectionElement.querySelector('p');

                rejectionMessage.innerHTML = result.message;
                rejectionElement.style.display = 'block';
                return;
            }

            // Show success result
            displayQuoteResult(result);

        } catch (error) {
            console.error('Error processing quote:', error);
            alert('Erro ao processar cotação. Tente novamente.');
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quote-request').style.display = 'block';
        }
    }, 500);
}

            // Get pricing
            let pricePB = getPrice(city, 'PB', actionTime);
            let priceColorido = getPrice(city, 'Colorido', actionTime);

            // If city not in pricing database, use São Paulo pricing with distance surcharge
            if (!pricePB || !priceColorido) {
                const basePB = getPrice('São Paulo', 'PB', actionTime) || 2200;
                const baseColorido = getPrice('São Paulo', 'Colorido', actionTime) || 2500;
                const distanceSurcharge = Math.ceil(roadDistance) * 9;

                pricePB = basePB + distanceSurcharge;
                priceColorido = baseColorido + distanceSurcharge;
            }

            // Apply date adjustment (dateAdjustment already declared at line 503)
            pricePB = pricePB * dateAdjustment.adjustmentFactor;
            priceColorido = priceColorido * dateAdjustment.adjustmentFactor;

            // Generate quote hash
            const hash = generateQuoteHash();
            const quoteDate = new Date().toLocaleString('pt-BR');

            // Create route details for non-cataloged cities
            let routeDetails = '';
            if (!pricePB || !priceColorido) {
                routeDetails = `
                    <p><strong>Detalhes da Rota:</strong></p>
                    <p>• Distância em linha reta: ${straightLineDistance.toFixed(1)} km</p>
                    <p>• Distância em rota de carro: ${roadDistance.toFixed(1)} km</p>
                    <p>• Base de cálculo: Zona Sul de São Paulo</p>
                    <p>• Sobretaxa por distância: R$ ${(Math.ceil(roadDistance) * 9).toFixed(2)}</p>
                `;
            }

            // Create quote data object
            window.currentQuoteData = {
                hash,
                eventDate,
                city,
                timeOption,
                actionTime,
                pricePB,
                priceColorido,
                quoteDate,
                guests: timeOption === 'guests' ? parseInt(numberInput) : null,
                guestDetails: timeOption === 'guests' ? guestDetails : null,
                routeDetails: routeDetails || null,
                clientName: clientName,
                clientPhone: clientPhone
            };

            // Save to history and get prices from database
            await saveQuoteHistory(window.currentQuoteData);

            // Display quote result with prices from database
            displayQuoteResult(window.currentQuoteData);

        } catch (error) {
            console.error('Error processing quote:', error);
            alert('Erro ao processar cotação. Tente novamente.');
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quote-request').style.display = 'block';
        }
    }, 1500);
}

// Process quote with confirmed time data
async function processQuoteWithTimeData(confirmedData) {
    const { eventDate, city, timeOption, actionTime, guests, clientName, clientPhone } = confirmedData;
    let numberInput = guests; // guests já contém o valor de convidados

    // Validar telefone (caso não tenha sido validado antes)
    if (clientPhone) {
        const validacaoTelefone = validarTelefone(clientPhone);
        if (!validacaoTelefone.valido) {
            alert('Numero de telefone invalido');
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quote-request').style.display = 'block';
            return;
        }
    }

    // Show loading
    document.getElementById('quote-request').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    // Call database function to calculate everything
    setTimeout(async function() {
        try {
            const result = await callCriarCotacao(eventDate, city, timeOption, numberInput, clientName, clientPhone);

            if (!result.success) {
                // Show rejection message from database
                document.getElementById('loading').style.display = 'none';
                const rejectionElement = document.getElementById('quote-rejected');
                const rejectionMessage = rejectionElement.querySelector('p');

                rejectionMessage.innerHTML = result.message;
                rejectionElement.style.display = 'block';
                return;
            }

            // Show success result
            displayQuoteResult(result);

        } catch (error) {
            console.error('Error processing quote:', error);
            alert('Erro ao processar cotação. Tente novamente.');
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quote-request').style.display = 'block';
        }
    }, 500);
}

            // Get pricing
            let pricePB = getPrice(city, 'PB', actionTime);
            let priceColorido = getPrice(city, 'Colorido', actionTime);

            // If city not in pricing database, use São Paulo pricing with distance surcharge
            if (!pricePB || !priceColorido) {
                const basePB = getPrice('São Paulo', 'PB', actionTime) || 2200;
                const baseColorido = getPrice('São Paulo', 'Colorido', actionTime) || 2500;
                const distanceSurcharge = Math.ceil(roadDistance) * 9;

                pricePB = basePB + distanceSurcharge;
                priceColorido = baseColorido + distanceSurcharge;
            }

            // Apply date adjustment
            pricePB = pricePB * dateAdjustment.adjustmentFactor;
            priceColorido = priceColorido * dateAdjustment.adjustmentFactor;

            // Generate quote hash
            const hash = generateQuoteHash();
            const quoteDate = new Date().toLocaleString('pt-BR');

            // Create route details for non-cataloged cities
            let routeDetails = '';
            if (!pricePB || !priceColorido) {
                routeDetails = `
                    <p><strong>Detalhes da Rota:</strong></p>
                    <p>• Distância em linha reta: ${straightLineDistance.toFixed(1)} km</p>
                    <p>• Distância em rota de carro: ${roadDistance.toFixed(1)} km</p>
                    <p>• Base de cálculo: Zona Sul de São Paulo</p>
                    <p>• Sobretaxa por distância: R$ ${(Math.ceil(roadDistance) * 9).toFixed(2)}</p>
                `;
            }

            // Create quote data object
            window.currentQuoteData = {
                hash,
                eventDate,
                city,
                timeOption,
                actionTime,
                pricePB,
                priceColorido,
                quoteDate,
                guests: timeOption === 'guests' ? parseInt(numberInput) : null,
                guestDetails: timeOption === 'guests' ? guestDetails : null,
                routeDetails: routeDetails || null,
                clientName: clientName,
                clientPhone: clientPhone
            };

            // Save to history and get prices from database
            await saveQuoteHistory(window.currentQuoteData);

            // Display quote result with prices from database
            displayQuoteResult(window.currentQuoteData);

        } catch (error) {
            console.error('Error processing quote:', error);
            alert('Erro ao processar cotação. Tente novamente.');
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quote-request').style.display = 'block';
        }
    }, 1500);
}

// Display quote result
function displayQuoteResult(currentQuoteData) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('quote-result').style.display = 'block';

    const quoteDetails = document.getElementById('quote-details');
    quoteDetails.innerHTML = `
        <h3>Detalhes da Cotação</h3>
        <p><strong>Código:</strong> ${currentQuoteData.hash}</p>
        <p><strong>Data do Evento:</strong> ${currentQuoteData.eventDate}</p>
        <p><strong>Cidade:</strong> ${currentQuoteData.city}</p>
        <p><strong>Tempo de Ação:</strong> ${currentQuoteData.actionTime} horas</p>

        ${currentQuoteData.routeDetails ? `
        <div class="guest-details">
            <h5>Detalhes da Rota:</h5>
            ${currentQuoteData.routeDetails}
        </div>
        ` : ''}

        <div class="guest-details">
            <h5>O SERVIÇO CONTEMPLA:</h5>
            <p>Todos os equipamentos necessários para aplicação das tatuagens temporárias, como: criação das artes, 1 equipamentos de impressão, tinta, tablet para mostrar os desenhos que podem ser tatuados, 2 funcionários para aplicação das tatuagens nos convidados do evento durante o tempo pré-definido de <strong>${currentQuoteData.actionTime} horas</strong>.</p>
        </div>

        <div class="price-section">
            <h4>Opções de Preço</h4>

            <div class="price-option">
                <h5>Preto e Branco</h5>
                <div class="price">${formatCurrency(currentQuoteData.pricePB)}</div>
                <div class="price-extenso">${currencyToWords(currentQuoteData.pricePB)} reais</div>
            </div>

            <div class="price-option">
                <h5>Colorido</h5>
                <div class="price">${formatCurrency(currentQuoteData.priceColorido)}</div>
                <div class="price-extenso">${currencyToWords(currentQuoteData.priceColorido)} reais</div>
            </div>
        </div>

        <div class="quote-hash">
            Código da Cotação: ${currentQuoteData.hash}
        </div>
    `;

    // Store current quote data for download/WhatsApp
    window.currentQuoteData = currentQuoteData;
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página index.html (não history.html)
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        // Form submission
        quoteForm.addEventListener('submit', handleQuoteForm);

        // Download Proposal button
        const downloadPdf = document.getElementById('download-pdf');
        if (downloadPdf) {
            downloadPdf.addEventListener('click', function() {
                if (window.currentQuoteData) {
                    generatePDF(window.currentQuoteData);
                }
            });
        }

        // WhatsApp button
        const whatsappBtn = document.getElementById('whatsapp-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', function() {
                if (window.currentQuoteData) {
                    const message = generateWhatsAppMessage(window.currentQuoteData);
                    const whatsappURL = `https://wa.me/5513997848897?text=${message}`;
                    window.open(whatsappURL, '_blank');
                }
            });
        }

        // New quote button
        const newQuote = document.getElementById('new-quote');
        if (newQuote) {
            newQuote.addEventListener('click', function() {
                document.getElementById('quote-result').style.display = 'none';
                document.getElementById('quote-request').style.display = 'block';
                quoteForm.reset();
                const numberField = document.getElementById('number-field');
                if (numberField) {
                    numberField.style.display = 'none';
                }
                window.currentQuoteData = null;
            });
        }

        // Try again button (for rejected quotes)
        const tryAgain = document.getElementById('try-again');
        if (tryAgain) {
            tryAgain.addEventListener('click', function() {
                const quoteRejected = document.getElementById('quote-rejected');
                const quoteRequest = document.getElementById('quote-request');
                if (quoteRejected) quoteRejected.style.display = 'none';
                if (quoteRequest) quoteRequest.style.display = 'block';
            });
        }

        // Set minimum date for event date input
        const eventDate = document.getElementById('event-date');
        if (eventDate) {
            const today = new Date().toISOString().split('T')[0];
            eventDate.setAttribute('min', today);
        }
    }
});