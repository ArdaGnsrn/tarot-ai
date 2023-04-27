import Image from 'next/image'
import {Inter} from 'next/font/google'
import {useEffect, useState} from "react";
import {sendMessage} from "@/utils/sendMessage";
import Head from "next/head";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const [tarotDeck, setTarotDeck] = useState([])
    const [flippedCards, setFlippedCards] = useState([])
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState("")
    const [topic, setTopic] = useState("")
    const [response, setResponse] = useState("")


    useEffect(() => {
        shuffleDeck(require('../tarot.json'))
    }, [])

    useEffect(() => {
        validateForm()
    }, [flippedCards, topic, name])

    function shuffleDeck(deck = null) {
        console.log("shuffleDeck")
        setTarotDeck((deck ?? tarotDeck).sort(() => Math.random() - 0.5))
    }

    function flipCard(name) {
        setFlippedCards([...flippedCards, name])
    }

    function validateForm() {
        setDisabled(name.length < 3 || topic.length < 3 || flippedCards.length < 3)
    }

    async function onSubmit() {
        setLoading(true)
        const {data} = await sendMessage([
            {
                role: 'system',
                content: 'You are ChatGPT, a large language model trained by OpenAI.',
            },
            {
                role: 'user',
                content: `Sen bir tarot fal yorumcususun. İnsanlara sana tarot falı baktırmak istiyor. Müşterilerine çok samimi bir şekilde ve isimlerini kullanarak cevap veriyorsun. Müşterinin seçtiği kartları yan yana gelme durumlarını ve sıralarını da dikkate alarak yorumlaman gerekiyor. Sen çok iyi bir tarot falcısısın. Destenin ismi: "Rider–Waite Tarot". İlk müşterinin adı "${name}" ve "${topic}" konusunda fal bakmanı istiyor. Seçtiği kartlar: ${flippedCards.join(", ")}. `,
            }
        ])
        setResponse(data.choices[0].message.content)
        setLoading(false)
    }

    return (
        <>
            <Head>
                <title>TarotAI - Yapay Zeka Destekli Tarot Falcınız</title>
                <meta name="description" content="Yapay zeka destekli tarot falcınız. İsminizi ve falınızı yazın, kartları seçin ve yorumlayın. Tarot falı bakmak hiç bu kadar kolay olmamıştı." />

                <meta property="og:title" content="TarotAI - Yapay Zeka Destekli Tarot Falcınız" />
                <meta property="og:description" content="Yapay zeka destekli tarot falcınız. İsminizi ve falınızı yazın, kartları seçin ve yorumlayın. Tarot falı bakmak hiç bu kadar kolay olmamıştı." />
                <meta property="og:image" content="https://snworksceo.imgix.net/dpn-34s/0b523c5c-4e9a-42e1-9ae1-b518b3c66180.sized-1000x1000.jpg?w=800" />
                <meta property="og:url" content="https://tarotai.vercel.app/" />

                <link rel="icon" href="/favicon.png" />
                <link rel="apple-touch-icon" href="/favicon.png" />
                <link rel="shortcut icon" href="/favicon.png" />
            </Head>
            <div className="flex flex-col p-4 mx-auto max-w-screen-md md:py-10 h-full">
                <main>
                    <div>
                        <div className="flex flex-wrap">
                            <h1
                                className="text-2xl font-bold mb-5 flex items-center text-gray-500">TAROT
                                <span className="rounded-md ml-1 text-white px-1 bg-red-600 w-8 h-8">AI</span>
                            </h1>
                            <span className="ml-auto my-2 text-gray-500 text-xs hidden md:block">This project is using GPT-3.5 to generate answers.</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Adınız
                                </label>
                                <input type="text" id="name"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="John" required value={name}
                                       onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="topic"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Fal Konusu
                                </label>
                                <input type="text" id="topic"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Aşk" required value={topic}
                                       onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-10 gap-1 mt-5 mb-5 ">
                            {tarotDeck.filter(t => flippedCards.includes(t.name)).map((card, index) => (
                                <div>
                                    <Image
                                        src={`/decks/rws/${flippedCards.includes(card.name) ? card.img : 'back.jpg'}`}
                                        width={350} height={600} alt="1"/>
                                    <div className="text-center text-sm text-gray-500">
                                        {card.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-start mt-2 flex-col md:flex-row">
                            <div className="text-sm text-gray-500 pr-5">
                                Aşağıdan en az 3 adet tarot kartı seçiniz. Kartları seçerken hissederek seçmeyi
                                unutmayın.
                                Kartları seçtikten sonra "Falı Yorumla" butonuna basarak falınızı yorumlayabilirsiniz.
                            </div>
                            <button type="button"
                                    disabled={disabled || loading}
                                    onClick={onSubmit}
                                    className={"inline-flex items-center justify-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white  transition ease-in-out duration-150 whitespace-nowrap mt-4 text-center w-full md:w-auto md:mt-0 " + ((disabled || loading) ? "bg-gray-400" : "bg-green-400 hover:bg-green-500")}>
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                )}
                                Falı Yorumla
                            </button>
                        </div>

                        {(!loading && response === "") && (
                            <div className="grid grid-cols-6 md:grid-cols-10 gap-1 mt-10 ">
                                {tarotDeck.map((card, index) => {
                                    let isFlipped = flippedCards.includes(card.name)
                                    return (
                                        <div className={isFlipped ? "" : "cursor-pointer"}
                                             onClick={() => (isFlipped ? "" : flipCard(card.name))}>
                                            <Image
                                                src={`/decks/rws/${isFlipped ? card.img : 'back.jpg'}`}
                                                width={350} height={600} alt="1"/>
                                            <div className="text-center text-sm text-gray-500">
                                                {isFlipped ? card.name : "???"}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        {(response !== "") && (
                            <div className="mt-10">
                                <div className="flex flex-wrap">
                                    <h1 className="text-2xl font-bold mb-5 flex items-center text-gray-500">FALINIZ</h1>
                                </div>
                                <p className="text-gray-500 text-sm whitespace-pre-line">
                                    {response}
                                </p>
                            </div>
                        )}

                        <span className="ml-auto my-2 text-gray-500 text-xs hidden md:block">Powered By. <a
                            href="https://www.ardagunsuren.com">Arda GÜNSÜREN</a></span>

                    </div>
                </main>
            </div>
        </>
    )
}
