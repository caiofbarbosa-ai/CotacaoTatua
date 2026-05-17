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


// =====================================================
// FUNÇÕES PARA CHAMAR BANCO DE DADOS
// =====================================================

// Call criar_cotacao function from database (handles all calculations)
async function callCriarCotacao(eventDate, city, timeOption, numberInput, clientName, clientPhone) {
    try {
        // Gera hash
        const hash = generateQuoteHash();

        // Determina action time
        let actionTime;
        let guests = null;

        if (timeOption === 'time') {
            actionTime = parseInt(numberInput);
        } else {
            guests = parseInt(numberInput);
            actionTime = calculateActionTime(guests);
        }

        // Chama função do banco de dados
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
            // Banco rejeitou (distance > 130 ou outra validação)
            return { success: false, message: result[0].message };
        }

        // Sucesso - retorna dados calculados pelo banco
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

// Generate unique quote hash
function generateQuoteHash() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `QTA-${timestamp}-${random}`;
}

// Calculate action time based on guests
function calculateActionTime(guests) {
    if (guests < 150) {
        return 2;
    }
    return Math.ceil((guests - 150) / 60.0) + 2;
}

// Format currency
function formatCurrency(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Convert currency to words (simplified)
function currencyToWords(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Generate WhatsApp message
function generateWhatsAppMessage(currentQuoteData) {
    const message = `*Cotação Tatuá*

*Evento:* ${currentQuoteData.eventDate}
*Local:* ${currentQuoteData.city}
*Tempo de Ação:* ${currentQuoteData.actionTime} horas

*Preços:*
• Preto e Branco: ${formatCurrency(currentQuoteData.pricePB)}
• Colorido: ${formatCurrency(currentQuoteData.priceColorido)}

Código: ${currentQuoteData.hash}

Aguardo seu contato para prosseguirmos!`;
    return encodeURIComponent(message);
}

// =====================================================
// FUNÇÕES PARA EXIBIR RESULTADOS
// =====================================================

// Display quote result
function displayQuoteResult(result) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('quote-result').style.display = 'block';

    const quoteDetails = document.getElementById('quote-details');
    quoteDetails.innerHTML = `
        <h3>Detalhes da Cotação</h3>
        <p><strong>Código:</strong> ${result.hash}</p>
        <p><strong>Data do Evento:</strong> ${result.eventDate}</p>
        <p><strong>Cidade:</strong> ${result.city}</p>
        <p><strong>Tempo de Ação:</strong> ${result.actionTime} horas</p>

        ${result.routeDetails ? `
        <div class="guest-details">
            <h5>Detalhes da Rota:</h5>
            ${result.routeDetails}
        </div>
        ` : ''}

        ${result.guestDetails ? `
        <div class="guest-details">
            <h5>Quantidade de Convidados:</h5>
            <p>${result.guestDetails}</p>
        </div>
        ` : ''}

        <div class="service-details">
            <h5>O SERVIÇO CONTEMPLA:</h5>
            <p>Todos os equipamentos necessários para aplicação das tatuagens temporárias, como: criação das artes, 1 equipamentos de impressão, tinta, tablet para mostrar os desenhos que podem ser tatuados, 2 funcionários para aplicação das tatuagens nos convidados do evento durante o tempo pré-definido de <strong>${result.actionTime} horas</strong>.</p>
        </div>

        <div class="price-section">
            <h4>Opções de Preço</h4>

            <div class="price-option">
                <h5>Preto e Branco</h5>
                <div class="price">${formatCurrency(result.pricePB)}</div>
                <div class="price-extenso">${currencyToWords(result.pricePB)} reais</div>
            </div>

            <div class="price-option">
                <h5>Colorido</h5>
                <div class="price">${formatCurrency(result.priceColorido)}</div>
                <div class="price-extenso">${currencyToWords(result.priceColorido)} reais</div>
            </div>
        </div>

        <div class="quote-hash">
            Código da Cotação: ${result.hash}
        </div>
    `;

    // Store current quote data for download/WhatsApp
    window.currentQuoteData = result;
}

// =====================================================
// MANIPULAÇÃO DO FORMULÁRIO
// =====================================================

// Handle form submission
async function handleQuoteForm(event) {
    event.preventDefault();

    console.log('Form submitted successfully');

    // Get form data
    const formData = new FormData(event.target);
    const eventDate = formData.get('event-date');
    const city = formData.get('city');
    const timeOption = formData.get('time-option');
    const numberInput = formData.get('number-input');
    const clientName = formData.get('client-name');
    const clientPhone = formData.get('client-phone');

// Bloquear tempo de ação acima de 8 horas
if (timeOption === 'time' && parseFloat(numberInput) > 8) {

    document.getElementById('loading').style.display = 'none';

    const rejectionElement = document.getElementById('quote-rejected');
    const rejectionMessage = rejectionElement.querySelector('p');

    rejectionMessage.innerHTML =
        'Para eventos com mais de 8 horas de ação, precisamos realizar um atendimento personalizado pelo WhatsApp.';

    document.getElementById('quote-request').style.display = 'none';

    rejectionElement.style.display = 'block';

    return;
}

    // Validar telefone
    const validacaoTelefone = validarTelefone(clientPhone);
    if (!validacaoTelefone.valido) {
        alert('Numero de telefone invalido');
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
                        formData: formData,
                        clientName: formData.get('client-name'),
                        clientPhone: formData.get('client-phone')
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
                    formData: formData,
                    clientName: formData.get('client-name'),
                    clientPhone: formData.get('client-phone')
                };
                showTimeConfirmation(suggestedTime);
                return;
            }

    // Show loading
    document.getElementById('quote-request').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    // Armazenar dados da cotação na variável global (para uso na mensagem de rejeição)
    window.quoteData = {
        city: city,
        eventDate: eventDate,
        actionTime: '' // Será preenchido após cálculo
    };

    // Call database function to calculate everything
    setTimeout(async function() {
        try {
		const inputValue =
		    timeOption === 'time'
        		? actionTime
        		: guests;

		const result = await callCriarCotacao(
		    eventDate,
		    city,
		    timeOption,
		    inputValue,
		    clientName,
    		    clientPhone
);
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

// Function to show number field based on time option selection
function showNumberField(value) {
    const numberField = document.getElementById('number-field');
    const numberLabel = document.getElementById('number-label');
    const numberInput = document.getElementById('number-input');

    numberField.style.display = 'block';

    if (value === 'guests') {
        numberLabel.textContent = 'Quantidade de convidados *';
        numberInput.min = '0';
        numberInput.placeholder = 'Digite o número de convidados';
    } else {
        numberLabel.textContent = 'Tempo de ação (horas) *';
        numberInput.min = '1';
        numberInput.placeholder = 'Digite o tempo em horas';
    }

    numberInput.value = '';
    numberInput.focus();
}

// Store temporary data for confirmation
let tempQuoteData = null;

// Show time confirmation modal
function showTimeConfirmation(suggestedHours) {
    const modal = document.getElementById('time-confirmation');
    const message = document.getElementById('confirmation-message');

    message.textContent = `Para essa quantidade de convidados, sugerimos ${suggestedHours} horas de ação, mas fica a seu critério caso prefira um valor diferente.`;
    modal.style.display = 'block';
}

// Show large event modal
function showLargeEventModal() {
    const modal = document.getElementById('large-event-modal');
    modal.style.display = 'block';
}

// Hide all modals
function hideAllModals() {
    document.getElementById('time-confirmation').style.display = 'none';
    document.getElementById('large-event-modal').style.display = 'none';
}

// Initialize event listeners for modals
document.addEventListener('DOMContentLoaded', function() {
    // Verify if we're on index.html (not history.html)
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

        // Confirm time button
        document.getElementById('confirm-time').addEventListener('click', function() {
            hideAllModals();
            if (tempQuoteData) {
                // Proceed with quote calculation
                processQuoteWithConfirmedTime(tempQuoteData);
            }
        });

        // Change time button
        document.getElementById('change-time').addEventListener('click', function() {
            hideAllModals();
            document.getElementById('quote-request').style.display = 'block';
            document.getElementById('number-field').style.display = 'block';
            document.getElementById('number-input').focus();
            tempQuoteData = null;
        });

        // Submit duration button
document.getElementById('submit-duration').addEventListener('click', function () {

    const duration = parseFloat(
        document.getElementById('event-duration').value
    );

    // Validar vazio
    if (!duration || duration <= 0) {
        alert('Por favor, insira uma duração válida para o evento.');
        return;
    }

    // BLOQUEIO > 8 HORAS
    if (duration > 8) {

        hideAllModals();

        document.getElementById('loading').style.display = 'none';

        const rejectionElement =
            document.getElementById('quote-rejected');

        const rejectionMessage =
            rejectionElement.querySelector('p');

        rejectionMessage.innerHTML =
            'Para eventos com mais de 8 horas de duração, precisamos realizar um atendimento personalizado pelo WhatsApp.';

        document.getElementById('quote-request').style.display = 'none';

        rejectionElement.style.display = 'block';

        // LIMPAR DADOS TEMPORÁRIOS
        tempQuoteData = null;

        // PARAR EXECUÇÃO
        return;
    }

    // Fluxo normal
    hideAllModals();

    if (tempQuoteData) {

        tempQuoteData.actionTime = duration;
        tempQuoteData.timeOption = 'time';

        processQuoteWithConfirmedTime(tempQuoteData);
    }
        });

        // Cancel duration button
        document.getElementById('cancel-duration').addEventListener('click', function() {
            hideAllModals();
            document.getElementById('quote-request').style.display = 'block';
            document.getElementById('number-field').style.display = 'block';
            document.getElementById('number-input').focus();
            tempQuoteData = null;
        });

        // Try again button (for rejected quotes)
        const tryAgain = document.getElementById('try-again');
        if (tryAgain) {
            tryAgain.addEventListener('click', function() {
                document.getElementById('quote-rejected').style.display = 'none';
                document.getElementById('quote-request').style.display = 'block';
            });
        }

        // Set minimum date for event date input
        const eventDateInput = document.getElementById('event-date');
        if (eventDateInput) {
            const today = new Date().toISOString().split('T')[0];
            eventDateInput.setAttribute('min', today);
        }
    }
});

// Process quote with confirmed time data
async function processQuoteWithConfirmedTime(confirmedData) {
    const { eventDate, city, timeOption, actionTime, guests, clientName, clientPhone } = confirmedData;

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
            const result = await callCriarCotacao(
    eventDate,
    city,
    'time',
    actionTime,
    clientName,
    clientPhone
);

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

// Generate and download document using Word template (simplified placeholder)
function generatePDF(currentQuoteData) {
    // Show loading state
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Gerando documento...';
    }

    // Simple PDF generation
    const pdfContent = `
===============================================
PROPOSTA DE TATUAGENS TEMPORÁRIAS
===============================================

Código: ${currentQuoteData.hash}
Data: ${currentQuoteData.eventDate}

Cliente: ${currentQuoteData.clientName || 'Não informado'}
Telefone: ${currentQuoteData.clientPhone || 'Não informado'}

Evento:
- Cidade: ${currentQuoteData.city}
- Data do Evento: ${currentQuoteData.eventDate}
- Tempo de Ação: ${currentQuoteData.actionTime} horas

Valores:
- Preto e Branco: ${formatCurrency(currentQuoteData.pricePB)}
  ${currencyToWords(currentQuoteData.pricePB)} reais
- Colorido: ${formatCurrency(currentQuoteData.priceColorido)}
  ${currencyToWords(currentQuoteData.priceColorido)} reais

${currentQuoteData.routeDetails || ''}

${currentQuoteData.guestDetails || ''}

O SERVIÇO CONTEMPLA:
- Criação das artes
- 1 equipamento de impressão
- Tinta e materiais
- Tablet com desenhos
- 2 funcionários
- Duração: ${currentQuoteData.actionTime} horas

===============================================
Gerado em: ${new Date().toLocaleString('pt-BR')}
===============================================
    `;

    // Download as text file for now
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposta_${currentQuoteData.city}_${currentQuoteData.eventDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Restore button
    if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download Proposta';
    }
}
