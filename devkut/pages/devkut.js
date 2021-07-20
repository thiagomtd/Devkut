import { useState, useEffect } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import nookies from 'nookies'
import jwt from 'jsonwebtoken'



function ProfileSidebar(props) {
  return (
    <Box as='aside'>
      <img
        src={`https://github.com/${props.githubUser}.png`}
        alt='Imagem de perfil '
        style={{ borderRadius: '8px' }}
      />
      <hr />
      <p>
        <a
          className='boxLink'
          target='_blank'
          href={`https://github.com/${props.githubUser}`}
        >
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault githubUser={props.githubUser} />
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
        {props.items.map((itemAtual) => {
          return (
            <li key={itemAtual.login}>
              <a target='blank' href={`https://github.com/${itemAtual.login}`}>
                <img src={`https://github.com/${itemAtual.login}.png`} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          );
        })}
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
        {props.items.map((itemAtual) => {
          return (
            <li key={itemAtual.login}>
              <a target='blank' href={`https://github.com/${itemAtual.login}`}>
                <img src={`https://github.com/${itemAtual.login}.png`} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {
  const githubUser = props.githubUser;
  const [projetos, setProjetos] = useState([]);
  const [repositorio, setRepositorio] = useState([]);


  const [seguidores, setSeguidores] = useState([]);
  const [seguindo, setSeguindo] = useState([]);

  useEffect(function () {
    // API Github seguidores
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((result) => {
        return result.json();
      })
      .then((allResults) => {
        setSeguidores(allResults);
      });
    

    // API Github seguindo
    fetch(`https://api.github.com/users/${githubUser}/following`)
      .then((result) => {
        return result.json();
      })
      .then((allResults) => {
        setSeguindo(allResults);
      });
    
    fetch(`https://api.github.com/users/${githubUser}/repos`)
      .then((result) => {
        return result.json();
      })
      .then((allResults) => {
        setRepositorio(allResults);
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
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className='profileArea' style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className='welcomeArea' style={{ gridArea: 'welcomeArea' }}>
          <Box className='title'>
            <h1>Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          {githubUser == 'thiagomtd' ? (
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
                    creatorSlug: githubUser,
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
          ) : (
            ''
          )}
        </div>

        <div
          className='profileRelationsArea'
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox title='Seguidores' items={seguidores} />
          <ProfileFollowing title='Seguindo' items={seguindo} />
          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'>Repositorios</h2>
            <ul>
              {repositorio.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a target='blank' href={itemAtual.html_url}>
                      <img
                        src={'https://github.githubassets.com/images/modules/logos_page/Octocat.png'}
                      />
                      <span>{itemAtual.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <>
              {githubUser == 'thiagomtd' ? (
                <>
                  <h2 className='smallTitle'>
                    {' '}
                    Projetos em destaque ({projetos.length})
                  </h2>
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
                </>
              ) : (
                <h2 className='smallTitle'>Sem Projetos cadastrados</h2>
              )}
            </>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.USER_TOKEN;
  const decodedToken = jwt.decode(token);
  const githubUser = decodedToken?.githubUser;

  if (!githubUser) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      githubUser,
    },
  };
}