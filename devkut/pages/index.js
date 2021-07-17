import { useState, useEffect } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
  return (
    <Box as='aside'>
      <img
        src={`https://github.com/${props.githubUserName}.png`}
        alt='Imagem de perfil '
        style={{ borderRadius: '8px' }}
      />
      <hr />
      <p>
        <a
          className='boxLink'
          href={`https://github.com/${props.githubUserName}`}
        >
          @{props.githubUserName}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className='smallTitle'>
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual} />
                <span>{itemAtual}</span>
              </a>
            </li>
          );
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

function ProfileFollowing(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className='smallTitle'>
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual} />
                <span>{itemAtual}</span>
              </a>
            </li>
          );
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const githubUserName = 'thiagomtd';
  const [projetos, setProjetos] = useState([]);

  const [seguidores, setSeguidores] = useState([]);
  const [seguindo, setSeguindo] = useState([]);

  useEffect(function () {
    // API Github seguidores
    fetch(`https://api.github.com/users/${githubUserName}/followers`)
      .then((result) => {
        return result.json();
      })
      .then((allResults) => {
        setSeguidores(allResults);
      });

    // API Github seguindo
    fetch(`https://api.github.com/users/${githubUserName}/following`)
      .then((result) => {
        return result.json();
      })
      .then((allResults) => {
        setSeguindo(allResults);
      });

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        Authorization: 'b1931e667b48ee77b2f080bcadc6af',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          allProjects{
            title
            id
            imageUrl
            pageLink
            creatorSlug
          }
        }`,
      }),
    })
      .then((response) => response.json())
      .then((allResponse) => {
        const projetosVindasDoDato = allResponse.data.allProjects;
        setProjetos(projetosVindasDoDato);
      });
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUserName} />
      <MainGrid>
        <div className='profileArea' style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUserName={githubUserName} />
        </div>

        <div className='welcomeArea' style={{ gridArea: 'welcomeArea' }}>
          <Box className='title'>
            <h1>Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className='subTitle'>Vamos criar mais um projeto ?</h2>
            <form
              onSubmit={function handleCreateCommunity(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                const projeto = {
                  title: dadosDoForm.get('title'),
                  imageUrl:
                    'https://github.githubassets.com/images/modules/logos_page/Octocat.png',
                  pageLink: dadosDoForm.get('link'),
                  creatorSlug: githubUserName,
                };

                fetch('/api/projetos', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(projeto),
                }).then(async (response) => {
                  const dados = await response.json();
                  const projeto = dados.registroCriado;
                  const projetosAtualizadas = [...projetos, projeto];
                  setProjetos(projetosAtualizadas);
                });

              }}
            >
              <div>
                <input
                  placeholder='Coloque o link o nome do projeto'
                  name='title'
                  aria-label='Coloque o link o nome do projeto'
                />
              </div>

              <div>
                <input
                  placeholder='Coloque o link do repositório'
                  name='link'
                  aria-label='Coloque o link do repositório'
                />
              </div>
              <button>Criar projeto</button>
            </form>
          </Box>
        </div>

        <div
          className='profileRelationsArea'
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox title='Seguidores' items={seguidores} />
          <ProfileFollowing title='Seguindo' items={seguindo} />
          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'>Projetos ({projetos.length})</h2>
            <ul>
              {projetos.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a target='blank' href={itemAtual.pageLink}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
