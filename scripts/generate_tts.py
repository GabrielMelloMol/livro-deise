import asyncio
import edge_tts
import os

# Textos por página extraídos do livro
# Completar com todos os textos após receber PDF final
PAGE_TEXTS = {
    1:  "Deise em... Tudo aqui já foi um sonho!",
    4:  "Esta é a história de uma menina chamada Deise, que vivia em uma comunidade de ruas apertadas e casas simples, onde a vida nem sempre era fácil, mas até que era muito divertida.",
    5:  "Ela morava com seus irmãos, passavam o dia brincando de queimada naquelas ruelas. Seus dias eram cheios de risadas e, também, de muitos desafios.",
    8:  "E dentro do coração daquela garotinha morava uma pergunta: Por que os adultos esquecem de seus sonhos? Ei, sonho, aonde vai com tanta pressa? Tá certo, você tem razão! E você vai ficar aí, parada? Não vai fazer nada? Vai deixar seu sonho morrer também? Mas por onde eu começo? E se?",
    10: "Deise imaginava um lugar mágico, repleto de livros, música, dança e, acima de tudo, esperança. Algumas pessoas diziam: Isso é grande demais para você!",
    11: "Quem acredita nos sonhos encontra forças para continuar.",
    14: "E assim nasceu a ARONG, uma organização não governamental que transformou vidas.",
    16: "A arte transforma vidas. Música, dança e alegria para todas as crianças.",
    19: "Algumas pessoas chegam como fadas madrinhas, iluminando nosso caminho.",
    22: "Cada livro é uma semente de um novo sonho.",
    30: "Tudo aqui já foi um sonho. E novos sonhos ainda podem nascer.",
}

VOICE = "pt-BR-FranciscaNeural"
OUTPUT_DIR = "assets/audio"

async def generate_page(page_id: int, text: str):
    filename = os.path.join(OUTPUT_DIR, f"page-{page_id:02d}.mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
    await communicate.save(filename)
    print(f"  Gerado: {filename}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    tasks = [generate_page(pid, txt) for pid, txt in PAGE_TEXTS.items()]
    await asyncio.gather(*tasks)
    print(f"\nTotal: {len(PAGE_TEXTS)} arquivos gerados em {OUTPUT_DIR}/")

if __name__ == "__main__":
    asyncio.run(main())
