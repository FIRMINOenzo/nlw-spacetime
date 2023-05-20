import { Text, View, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { useEffect } from "react";

import { api } from "../src/lib/api";
import { useRouter } from "expo-router";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

import * as SecureStore from "expo-secure-store";

import Stripes from "../src/assets/stripes.svg";
import NLWLogo from "../src/assets/nlw-logo.svg";

const StyledStripes = styled(Stripes);

export default function App() {
  const router = useRouter();

  const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint:
      "https://github.com/settings/connections/applications/55bec1b49b3cada04a22",
  };

  const [request, response, signInWithGitHub] = useAuthRequest(
    {
      clientId: "55bec1b49b3cada04a22",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  async function handleGithubOauthCode(code: string) {
    const response = await api.post("/register", {
      code,
    });

    const { token } = response.data;

    await SecureStore.setItemAsync("token", token);

    router.push("/memories");
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      handleGithubOauthCode(code);
    }
  }, [response]);

  return (
    <View className="flex-1 items-center  px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-cent font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGitHub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembranças
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  );
}
