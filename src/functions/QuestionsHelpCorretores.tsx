import { QuestionsType } from "@/interfaces/Corretores";

export const QUESTIONS = [
    {pergunta: 'O que fazer se eu não concordar com o valor da comissão?', resposta: 'Você deve entrar em contato com seu Gerente imediatamente.'},
    {pergunta: 'Quanto tempo leva para a transferência ser concluída?', resposta: 'O pagamento cai em até 2 dias úteis após a comissão ser paga pelo cliente, desde que você já tenha confirmado o valor e enviado o recibo ou nota fiscal.'},
    {pergunta: 'Por que ainda não recebi minha comissão?', resposta: 'Para receber sua comissão, os clientes pagadores devem pagar ao menos um dos boletos referentes à compra do imóvel. Além disso, a comissão só é transferida depois que o corretor envia o recibo (ou NFe) assinada,'},
    {pergunta: 'Como são calculadas as temperaturas dos imóveis?', resposta: 'A temperatura representa o tempo desde o cadastro do laudo de avaliação. Sendo: Quente: imóveis com até 90 dias de cadastro. Morno: entre 91 e 180 dias. Frio: mais de 181 dias. Para aquecer a temperatura do imóvel, é preciso reduzir seu valor em 5% ou mais.'},
    {pergunta: 'Como posso aumentar a temperatura do imóvel?', resposta: 'Ao atualizar o preço com um valor até 5% (a partir de) menor que o anterior, a data do laudo é zerada e o imóvel sobe um nível de temperatura: frio vira morno, e morno vira quente.'},
    {pergunta: 'Como é calculado o potencial de retorno?', resposta: 'O potencial de retorno é uma estimativa de quanto o corretor pode ganhar com as comissões de seus imóveis quentes. O cálculo considera valor anunciado do imóvel, comissão da opção selecionada e participação do corretor na venda.'},
  ] as QuestionsType;