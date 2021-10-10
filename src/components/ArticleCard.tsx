import { Box } from '@chakra-ui/layout';
import { Image, Stack, Text } from '@chakra-ui/react';
import router from 'next/router';
import Date from './Date';
import { VFC, memo } from 'react';

type Props = {
  id: string;
  date: string;
  title: string;
  image: string;
};

const ArticleCard: VFC<Props> = (props) => {
  const { id, date, title, image } = props;
  return (
    <Box
      w='360px'
      h='360px'
      bg='gray.100'
      borderRadius='20px'
      p='4'
      onClick={() => router.push(`/posts/${id}`)}
      _hover={{ opacity: 0.5, cursor: 'pointer' }}
    >
      <Stack textAlign='center'>
        <Image
          src={require(`../../posts/${id}/${image}`)}
          boxSize='240px'
          alt='thumbnail'
          m='auto'
          borderRadius='full'
          fit='contain'
        />
        <Text fontSize='lg' fontWeight='bold'>
          {title}
        </Text>
        <Date dateString={date} />
      </Stack>
    </Box>
  );
};

export default memo(ArticleCard);
