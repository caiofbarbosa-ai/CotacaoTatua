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

// Save quote to history
function saveQuoteHistory(currentQuoteData) {
    const history = JSON.parse(localStorage.getItem('quoteHistory') || '[]');
    history.push(currentQuoteData);
    localStorage.setItem('quoteHistory', JSON.stringify(history));
}

// Generate and download PDF using Word template
function generatePDF(currentQuoteData) {
    // Show loading state
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Gerando PDF...';
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
            const currentDate = new Date().toLocaleDateString('pt-BR');
            const templateData = {
                'data atual': currentDate,
                'cidade escolhida': currentQuoteData.city,
                'tempo de ação': currentQuoteData.actionTime + ' horas',
                'valor pb': formatCurrency(currentQuoteData.pricePB),
                'valor pb extenso': numberToWords(Math.floor(currentQuoteData.pricePB)) + ' reais',
                'valor colorido': formatCurrency(currentQuoteData.priceColorido),
                'valor colorido extenso': numberToWords(Math.floor(currentQuoteData.priceColorido)) + ' reais',
                'hash proposta': currentQuoteData.hash
            };

            // Handle guest details lines if present
            if (currentQuoteData.timeOption === 'guests' && currentQuoteData.guestDetails) {
                const guestDetails = currentQuoteData.guestDetails.replace(/<[^>]*>/g, '').replace(/•/g, '').trim();
                const lines = guestDetails.split('\n').filter(line => line.trim() !== '');

                if (lines.length >= 1) templateData['linha 1'] = lines[0].trim();
                if (lines.length >= 2) templateData['linha 2'] = lines[1].trim();
                if (lines.length >= 3) templateData['linha 3'] = lines[2].trim();
            } else {
                // Clear guest detail lines if not guest option
                templateData['linha 1'] = '';
                templateData['linha 2'] = '';
                templateData['linha 3'] = '';
            }

            // Calculate action time if not already set
            if (currentQuoteData.timeOption === 'guests') {
                const guestsMatch = currentQuoteData.guestDetails?.match(/Número de convidados:\s*(\d+)/);
                if (guestsMatch) {
                    const guests = parseInt(guestsMatch[1]);
                    templateData['tempo de ação calculada'] = calculateActionTime(guests) + ' horas';
                } else {
                    templateData['tempo de ação calculada'] = currentQuoteData.actionTime + ' horas';
                }
            } else {
                templateData['tempo de ação calculada'] = currentQuoteData.actionTime + ' horas';
            }

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

            // Generate the output document
            const out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            // Convert Word to HTML then to PDF
            return out.arrayBuffer();
        })
        .then(arrayBuffer => {
            // Convert Word to HTML using Mammoth
            return mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        })
        .then(result => {
            // Create a temporary div to render the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result.value;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.width = '210mm'; // A4 width
            tempDiv.style.padding = '20mm';
            tempDiv.style.background = 'white';
            tempDiv.style.fontFamily = 'Arial, sans-serif';
            document.body.appendChild(tempDiv);

            // Convert HTML to PDF using html2canvas and jsPDF
            return html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                logging: false
            }).then(canvas => {
                // Remove temporary div
                document.body.removeChild(tempDiv);

                // Create PDF
                const { jsPDF } = window.jspdf;
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = (pdfHeight - imgHeight * ratio) / 2;

                pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

                // Save PDF
                pdf.save(`cotacao_${currentQuoteData.hash}.pdf`);

                // Reset button state
                if (downloadBtn) {
                    downloadBtn.disabled = false;
                    downloadBtn.textContent = 'Download PDF';
                }
            });
        })
        .catch(error => {
            console.error('Erro ao gerar PDF:', error);
            // Don't show alert if we already used fallback
            if (downloadBtn && downloadBtn.disabled) {
                alert('Erro ao gerar o PDF: ' + error.message + '. Usando método alternativo.');
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
    const pricePBWords = numberToWords(Math.floor(currentQuoteData.pricePB)) + ' reais';

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
    const priceColoridoWords = numberToWords(Math.floor(currentQuoteData.priceColorido)) + ' reais';

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

    // Add date adjustment details if present
    if (currentQuoteData.dateAdjustmentDetails) {
        message += `
${currentQuoteData.dateAdjustmentDetails.replace(/<[^>]*>/g, '').replace(/<[^>]*>/g, '')}`;
    }

    message += `
*Opções de Preço:*
🎨 Preto e Branco: ${formatCurrency(currentQuoteData.pricePB)}
🌈 Colorido: ${formatCurrency(currentQuoteData.priceColorido)}

Aguardo contato para prosseguirmos!`;

    return encodeURIComponent(message);
}

// Process quote with confirmed time data
function processQuoteWithTimeData(confirmedData) {
    const { eventDate, city, timeOption, actionTime, guests } = confirmedData;

    // Show loading
    document.getElementById('quote-request').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    // Simulate processing delay
    setTimeout(function() {
        try {
            // Check date adjustment rules
            const dateAdjustment = calculateDateAdjustment(eventDate);

            // If date is rejected
            if (dateAdjustment.shouldReject) {
                document.getElementById('loading').style.display = 'none';

                // Update rejection message
                const rejectionElement = document.getElementById('quote-rejected');
                const rejectionMessage = rejectionElement.querySelector('p');

                if (dateAdjustment.rejectReason.includes('muito distante')) {
                    rejectionMessage.textContent = dateAdjustment.rejectReason;
                } else if (dateAdjustment.rejectReason.includes('anterior')) {
                    rejectionMessage.textContent = dateAdjustment.rejectReason;
                }

                rejectionElement.style.display = 'block';
                return;
            }

            let guestDetails = '';

            if (timeOption === 'guests' && guests) {
                guestDetails = `
                    <p><strong>Linha 1:</strong> Número de convidados: ${guests}</p>
                    <p><strong>Linha 2:</strong> Base mínima: 150 convidados</p>
                    <p><strong>Linha 3:</strong> Excedente: ${guests - 150} convidados</p>
                `;
            }

            // Get city coordinates
            const cityCoords = getCityCoordinates(city);
            const straightLineDistance = calculateStraightLineDistance(
                cityCoords.lat,
                cityCoords.lon,
                saoPauloZoneSul.lat,
                saoPauloZoneSul.lon
            );
            const roadDistance = calculateRoadDistance(
                cityCoords.lat,
                cityCoords.lon,
                saoPauloZoneSul.lat,
                saoPauloZoneSul.lon
            );

            // Check distance limit
            if (roadDistance > 130) {
                document.getElementById('loading').style.display = 'none';

                const rejectionElement = document.getElementById('quote-rejected');
                const rejectionTitle = rejectionElement.querySelector('h1');
                const rejectionMessage = rejectionElement.querySelector('p');

                rejectionTitle.textContent = 'Cotação Não Disponível';
                rejectionMessage.textContent = 'Desculpe, infelizmente não conseguimos atender a sua região.';

                rejectionElement.style.display = 'block';
                return;
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

            // Create date adjustment details
            let dateAdjustmentDetails = '';
            if (dateAdjustment.adjustmentPercentage > 0) {
                dateAdjustmentDetails = `
                    <p><strong>Detalhes do Ajuste de Data:</strong></p>
                    <p>• Evento em ${diffDaysBetweenDates(eventDate, new Date()).toFixed(0)} dias</p>
                    <p>• Ajuste aplicado: +${dateAdjustment.adjustmentPercentage}%</p>
                    <p>• Motivo: Evento entre 1 e 2 anos da data atual</p>
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
                guestDetails: timeOption === 'guests' ? guestDetails : null,
                routeDetails: routeDetails || null,
                dateAdjustmentDetails: dateAdjustmentDetails || null
            };

            // Save to history
            saveQuoteHistory(window.currentQuoteData);

            // Display quote result
            displayQuoteResult(window.currentQuoteData);

        } catch (error) {
            console.error('Error processing quote:', error);
            alert('Erro ao processar cotação. Tente novamente.');
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quote-request').style.display = 'block';
        }
    }, 1500);
}

// Handle form submission
function handleQuoteForm(event) {
    event.preventDefault();

    console.log('Form submitted successfully'); // Debug

    // Check if we have confirmed time data
    if (window.confirmedTimeData) {
        const confirmedData = window.confirmedTimeData;
        window.confirmedTimeData = null;

        // Use the confirmed data
        processQuoteWithTimeData(confirmedData);
        return;
    }

    // Get form data
    const formData = new FormData(event.target);
    const eventDate = formData.get('event-date');
    const city = formData.get('city');
    const timeOption = formData.get('time-option');
    const numberInput = formData.get('number-input');

    console.log('Form data:', { eventDate, city, timeOption, numberInput }); // Debug

    // Show loading
    document.getElementById('quote-request').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    // Simulate processing delay
    setTimeout(function() {
        try {
            // Check date adjustment rules
            const dateAdjustment = calculateDateAdjustment(eventDate);

            // If date is rejected
            if (dateAdjustment.shouldReject) {
                document.getElementById('loading').style.display = 'none';

                // Update rejection message
                const rejectionElement = document.getElementById('quote-rejected');
                const rejectionMessage = rejectionElement.querySelector('p');

                if (dateAdjustment.rejectReason.includes('muito distante')) {
                    rejectionMessage.textContent = dateAdjustment.rejectReason;
                } else if (dateAdjustment.rejectReason.includes('anterior')) {
                    rejectionMessage.textContent = dateAdjustment.rejectReason;
                }

                rejectionElement.style.display = 'block';
                return;
            }
            // Calculate action time
            let actionTime;
            let guestDetails = '';

            if (timeOption === 'time') {
                actionTime = parseInt(numberInput);
            } else {
                const guests = parseInt(numberInput);

                // Check if it's a large event (> 500 guests)
                if (guests > 500) {
                    // Show large event modal
                    document.getElementById('loading').style.display = 'none';
                    tempQuoteData = {
                        eventDate,
                        city,
                        timeOption,
                        guests: guests,
                        formData: formData
                    };
                    showLargeEventModal();
                    return;
                }

                // Calculate suggested time
                const suggestedTime = calculateActionTime(guests);

                // Show time confirmation modal
                document.getElementById('loading').style.display = 'none';
                tempQuoteData = {
                    eventDate,
                    city,
                    timeOption,
                    actionTime: suggestedTime,
                    guests: guests,
                    formData: formData
                };
                showTimeConfirmation(suggestedTime);
                return;
            }

            // Get city coordinates
            const cityCoords = getCityCoordinates(city);
            const straightLineDistance = calculateStraightLineDistance(
                cityCoords.lat,
                cityCoords.lon,
                saoPauloZoneSul.lat,
                saoPauloZoneSul.lon
            );
            const roadDistance = calculateRoadDistance(
                cityCoords.lat,
                cityCoords.lon,
                saoPauloZoneSul.lat,
                saoPauloZoneSul.lon
            );

            // Check distance limit
            if (roadDistance > 130) {
                document.getElementById('loading').style.display = 'none';

                const rejectionElement = document.getElementById('quote-rejected');
                const rejectionTitle = rejectionElement.querySelector('h1');
                const rejectionMessage = rejectionElement.querySelector('p');

                rejectionTitle.textContent = 'Cotação Não Disponível';
                rejectionMessage.textContent = 'Desculpe, infelizmente não conseguimos atender a sua região.';

                rejectionElement.style.display = 'block';
                return;
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

            // Create date adjustment details
            let dateAdjustmentDetails = '';
            if (dateAdjustment.adjustmentPercentage > 0) {
                dateAdjustmentDetails = `
                    <p><strong>Detalhes do Ajuste de Data:</strong></p>
                    <p>• Evento em ${diffDaysBetweenDates(eventDate, new Date()).toFixed(0)} dias</p>
                    <p>• Ajuste aplicado: +${dateAdjustment.adjustmentPercentage}%</p>
                    <p>• Motivo: Evento entre 1 e 2 anos da data atual</p>
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
                guestDetails: timeOption === 'guests' ? guestDetails : null,
                routeDetails: routeDetails || null,
                dateAdjustmentDetails: dateAdjustmentDetails || null
            };

            // Save to history
            saveQuoteHistory(window.currentQuoteData);

            // Display quote result
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

        ${currentQuoteData.dateAdjustmentDetails ? `
        <div class="guest-details">
            <h5>Detalhes do Ajuste de Data:</h5>
            ${currentQuoteData.dateAdjustmentDetails}
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
                <div class="price-extenso">${numberToWords(Math.floor(currentQuoteData.pricePB))} reais</div>
            </div>

            <div class="price-option">
                <h5>Colorido</h5>
                <div class="price">${formatCurrency(currentQuoteData.priceColorido)}</div>
                <div class="price-extenso">${numberToWords(Math.floor(currentQuoteData.priceColorido))} reais</div>
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
    // Form submission
    document.getElementById('quote-form').addEventListener('submit', handleQuoteForm);

    // Download PDF button
    document.getElementById('download-pdf').addEventListener('click', function() {
        if (window.currentQuoteData) {
            generatePDF(window.currentQuoteData);
        }
    });

    // WhatsApp button
    document.getElementById('whatsapp-btn').addEventListener('click', function() {
        if (window.currentQuoteData) {
            const message = generateWhatsAppMessage(window.currentQuoteData);
            const whatsappURL = `https://wa.me/5513997848897?text=${message}`;
            window.open(whatsappURL, '_blank');
        }
    });

    // New quote button
    document.getElementById('new-quote').addEventListener('click', function() {
        document.getElementById('quote-result').style.display = 'none';
        document.getElementById('quote-request').style.display = 'block';
        document.getElementById('quote-form').reset();
        document.getElementById('number-field').style.display = 'none';
        window.currentQuoteData = null;
    });

    // Try again button (for rejected quotes)
    document.getElementById('try-again').addEventListener('click', function() {
        document.getElementById('quote-rejected').style.display = 'none';
        document.getElementById('quote-request').style.display = 'block';
    });

    // Set minimum date for event date input
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('event-date').setAttribute('min', today);
});