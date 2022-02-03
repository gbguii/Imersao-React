import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import {useRouter} from 'next/router'
import { ButtonSendSticker } from '../src/componentes/Stickers'


const SUPABASE_ANOW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU3MTM0NSwiZXhwIjoxOTU5MTQ3MzQ1fQ.4klodTmgeMgNbINWuRhaTnuPzLHD46yhVZRLnnV4MMI";
const SUPABASE_URL = "https://omdykuwqalsxwiipwkhe.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANOW_KEY)
                                
function atualizaMensagem(adicionaMensagem){
    return supabaseClient
    .from('mensagens')
    .on('INSERT', (mensagemLive) => {
        adicionaMensagem(mensagemLive.new);
    })
    .subscribe();
}

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    //console.log(usuarioLogado);
    //console.log(roteamento.query);
    const [mensagem, setMensagem] = React.useState("");
    const [listaMensagem, setListaMensagem] = React.useState([]);
    // Sua lógica vai aqui

    // ./Sua lógica vai aqui
    React.useEffect( () =>{
        supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', {ascending: false})
        .then(({data}) => {
            //console.log(data)
            setListaMensagem(data)
        });
        atualizaMensagem((novaMensagem) => {
            setListaMensagem((valorAtualDaLista) => {
                return[
                    novaMensagem,
                    ...valorAtualDaLista
                ]
            });
        });
    }, [])



    function handleNovaMensagem(novaMensagem) {
        if(novaMensagem != ""){
            const mensagem = {
                //id: listaMensagem.length + 1,
                de: "gbguii",
                texto: novaMensagem
            }
            supabaseClient
            .from('mensagens')
            .insert([mensagem])
            .then( ({data}) => {
                
            })
        }else{return;}
        
    }
    function sendMensagem(event){
        if (event.key == "Enter") {
            event.preventDefault();
            handleNovaMensagem(mensagem);
        }
        if(event.type == "click"){
            event.preventDefault();
            handleNovaMensagem(mensagem);
        }
    }
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagem={listaMensagem}/>
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "center",
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                sendMensagem(event)
                            }}
                            
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <button
                        onClick={(event) => {
                            sendMensagem(event)
                        }}
                        >Enviar</button>
                        <style jsx>{`
                            button{
                                padding: 5px 10px;
                                margin: auto;
                                margin-right: 10px;
                                background-color: #181F25;
                                color: #CBD2D9;
                                border-radius: 5px;
                            }
                        `}</style>
                        <ButtonSendSticker 
                            onStickerClick={(sticker) =>{
                                handleNovaMensagem(`:sticker: ${sticker}`)
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    //console.log('MessageList', props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagem.map((mensagem) => {
                return (
                    <Text
                        
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(":sticker:")
                        ?(
                            <Image src={mensagem.texto.replace(':sticker:', '')} />
                        )
                        :(
                            mensagem.texto
                        )
                        }
                    </Text>
                );
            })}
        </Box>
    )
}